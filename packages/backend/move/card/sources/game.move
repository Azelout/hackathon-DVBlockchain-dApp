#[allow(lint(public_random))]
module card::game;

use sui::random::{Random, new_generator};
use sui::event::emit;
use card::card::{Card, points};

public struct Game has key {
    id: UID,
    player1: address,
    player2: address,
    deck1: vector<Card>,
    deck2: vector<Card>,
    hand1: vector<Card>,
    hand2: vector<Card>,
    turn: u64,
    p1_swapped: bool,
    p2_swapped: bool,
    is_finished: bool,
}

public struct CardRevealed has copy, drop {
    game_id: ID,
    player: address,
    card_index: u64,
}

public struct GameResolved has copy, drop {
    game_id: ID,
    winner: address,
    score1: u64,
    score2: u64,
}

public struct Lobby has key {
    id: UID,
    player1: address,
    cards1: vector<Card>,
}

public fun create_lobby(
    mut cards1: vector<Card>,
    ctx: &mut TxContext
) {
    let lobby = Lobby {
        id: object::new(ctx),
        player1: ctx.sender(),
        cards1,
    };
    transfer::share_object(lobby);
}

public fun create_poc_game(
    mut cards1: vector<Card>,
    player2: address,
    r: &Random,
    ctx: &mut TxContext
) {
    let mut generator = new_generator(r, ctx);

    // Create dummy deck for player 2
    let mut cards2 = vector::empty<Card>();
    let mut i = 0;
    while (i < 7) {
        let card = card::card::mint(
            std::string::utf8(b"Enemy Card"),
            std::string::utf8(b""),
            std::string::utf8(b"Enemy"),
            10, // Fixed points for PoC
            ctx
        );
        cards2.push_back(card);
        i = i + 1;
    };

    // Shuffle deck 1
    /*
    let len1 = cards1.length();
    let mut i = 0;
    while (i < len1) {
        let j = generator.generate_u64_in_range(i, len1);
        cards1.swap(i, j);
        i = i + 1;
    };

    // Shuffle deck 2
    let len2 = cards2.length();
    let mut k = 0;
    while (k < len2) {
        let l = generator.generate_u64_in_range(k, len2);
        cards2.swap(k, l);
        k = k + 1;
    };
    */

    // Deal 3 cards to each player
    let mut hand1 = vector::empty<Card>();
    let mut hand2 = vector::empty<Card>();

    let mut m = 0;
    while (m < 3) {
        hand1.push_back(cards1.pop_back());
        hand2.push_back(cards2.pop_back());
        m = m + 1;
    };

    let game = Game {
        id: object::new(ctx),
        player1: ctx.sender(),
        player2,
        deck1: cards1,
        deck2: cards2,
        hand1,
        hand2,
        turn: 0, 
        p1_swapped: false,
        p2_swapped: false,
        is_finished: false,
    };

    transfer::share_object(game);
}

public fun join_lobby(
    mut lobby: Lobby,
    mut cards2: vector<Card>,
    r: &Random,
    ctx: &mut TxContext
) {
    let Lobby { id, player1, mut cards1 } = lobby;
    object::delete(id); // Delete the lobby object

    let mut generator = new_generator(r, ctx);

    // Shuffle deck 1
    let len1 = cards1.length();
    let mut i = 0;
    while (i < len1) {
        let j = generator.generate_u64_in_range(i, len1);
        cards1.swap(i, j);
        i = i + 1;
    };

    // Shuffle deck 2
    let len2 = cards2.length();
    let mut k = 0;
    while (k < len2) {
        let l = generator.generate_u64_in_range(k, len2);
        cards2.swap(k, l);
        k = k + 1;
    };

    // Deal 3 cards to each player
    let mut hand1 = vector::empty<Card>();
    let mut hand2 = vector::empty<Card>();

    let mut m = 0;
    while (m < 3) {
        hand1.push_back(cards1.pop_back());
        hand2.push_back(cards2.pop_back());
        m = m + 1;
    };

    let game = Game {
        id: object::new(ctx),
        player1,
        player2: ctx.sender(),
        deck1: cards1,
        deck2: cards2,
        hand1,
        hand2,
        turn: 0, 
        p1_swapped: false,
        p2_swapped: false,
        is_finished: false,
    };

    transfer::share_object(game);
}

public fun play_turn(game: &mut Game, _ctx: &mut TxContext) {
    assert!(!game.is_finished, 0);
    assert!(game.turn < 3, 1);

    // Reveal card for both players (conceptually)
    // In reality, we just increment turn, and frontend shows the card at index `turn`
    
    emit(CardRevealed {
        game_id: object::id(game),
        player: game.player1,
        card_index: game.turn,
    });

    emit(CardRevealed {
        game_id: object::id(game),
        player: game.player2,
        card_index: game.turn,
    });

    game.turn = game.turn + 1;
}

public fun swap_card(game: &mut Game, r: &Random, ctx: &mut TxContext) {
    assert!(!game.is_finished, 0);
    let sender = ctx.sender();
    
    // Determine which player is swapping
    if (sender == game.player1) {
        assert!(!game.p1_swapped, 2);
        game.p1_swapped = true;
        
        // Swap current revealed card (turn - 1) with random card from deck
        let card_idx = game.turn - 1;
        let mut generator = new_generator(r, ctx);
        let deck_idx = generator.generate_u64_in_range(0, game.deck1.length());
        
        let hand_card = game.hand1.swap_remove(card_idx);
        let deck_card = game.deck1.swap_remove(deck_idx);
        
        game.hand1.push_back(deck_card);
        let last_idx = game.hand1.length() - 1;
        game.hand1.swap(card_idx, last_idx); // Put back in correct position
        
        game.deck1.push_back(hand_card);
        
    } else if (sender == game.player2) {
        assert!(!game.p2_swapped, 2);
        game.p2_swapped = true;
        
        let card_idx = game.turn - 1;
        let mut generator = new_generator(r, ctx);
        let deck_idx = generator.generate_u64_in_range(0, game.deck2.length());
        
        let hand_card = game.hand2.swap_remove(card_idx);
        let deck_card = game.deck2.swap_remove(deck_idx);
        
        game.hand2.push_back(deck_card);
        let last_idx = game.hand2.length() - 1;
        game.hand2.swap(card_idx, last_idx);
        
        game.deck2.push_back(hand_card);
    } else {
        abort 3 // Not a player
    };
}

public fun resolve_game(game: &mut Game, r: &Random, ctx: &mut TxContext) {
    assert!(game.turn == 3, 4); // Must be after 3 turns
    assert!(!game.is_finished, 0);
    
    game.is_finished = true;

    // Calculate scores
    let mut score1 = 0;
    let mut i = 0;
    while (i < 3) {
        score1 = score1 + points(&game.hand1[i]);
        i = i + 1;
    };

    let mut score2 = 0;
    let mut j = 0;
    while (j < 3) {
        score2 = score2 + points(&game.hand2[j]);
        j = j + 1;
    };

    let winner = if (score1 >= score2) game.player1 else game.player2;
    // loser variable removed as it was unused

    emit(GameResolved {
        game_id: object::id(game),
        winner,
        score1,
        score2,
    });

    // Transfer random card from loser to winner
    let mut generator = new_generator(r, ctx);
    
    if (winner == game.player1) {
        // Take from player 2 (loser)
        if (!game.deck2.is_empty()) {
            let idx = generator.generate_u64_in_range(0, game.deck2.length());
            let card = game.deck2.swap_remove(idx);
            transfer::public_transfer(card, winner);
        } else {
            let idx = generator.generate_u64_in_range(0, game.hand2.length());
            let card = game.hand2.swap_remove(idx);
            transfer::public_transfer(card, winner);
        };
    } else {
        // Take from player 1 (loser)
        if (!game.deck1.is_empty()) {
            let idx = generator.generate_u64_in_range(0, game.deck1.length());
            let card = game.deck1.swap_remove(idx);
            transfer::public_transfer(card, winner);
        } else {
            let idx = generator.generate_u64_in_range(0, game.hand1.length());
            let card = game.hand1.swap_remove(idx);
            transfer::public_transfer(card, winner);
        };
    };
}
