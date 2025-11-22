module card::card;

use std::string::{utf8, String};
use sui::event::emit;
use sui::package;
use sui::display;

// === Structs ===

public struct Card has key, store {
    id: UID,
    name: String,
    img: String,
    label: String,
    points: u64,
}

public struct CARD has drop {}

public struct AdminCap has key, store {
    id: UID,
}

public struct CardRegistry has key {
    id: UID,
    cards: vector<CardInfo>,
}

public struct CardInfo has copy, drop, store {
    name: String,
    img: String,
    label: String,
    points: u64,
}

// === Events ===

public struct EventCardCreated has copy, drop {
    card_id: ID,
}

// === Init ===

fun init(otw: CARD, ctx: &mut TxContext) {
    let keys = vector[
        utf8(b"name"),
        // utf8(b"image_url"),
        utf8(b"description"),
        // utf8(b"project_url"),
        // utf8(b"creator"),
    ];

    let values = vector[
        utf8(b"{name}"),
        // utf8(b"{img}"),
        utf8(b"Card {name} with {points} points"),
        // utf8(b"https://sui.io"),
        // utf8(b"Sui Hackathon"),
    ];

    let publisher = package::claim(otw, ctx);

    let mut display = display::new_with_fields<Card>(
        &publisher,
        keys,
        values,
        ctx,
    );

    display::update_version(&mut display);

    transfer::public_transfer(publisher, ctx.sender());
    transfer::public_transfer(display, ctx.sender());

    transfer::public_transfer(AdminCap { id: object::new(ctx) }, ctx.sender());

    transfer::share_object(CardRegistry {
        id: object::new(ctx),
        cards: vector::empty(),
    });
}

// === Public Functions ===

#[allow(lint(self_transfer))]
public fun create(
    _: &AdminCap,
    registry: &mut CardRegistry,
    name: String,
    img: String,
    label: String,
    points: u64,
    ctx: &mut TxContext
) {
    let card = Card {
        id: object::new(ctx),
        name,
        img,
        label,
        points,
    };

    let info = CardInfo {
        name,
        img,
        label,
        points,
    };

    registry.cards.push_back(info);

    emit(EventCardCreated {
        card_id: object::id(&card),
    });

    transfer::transfer(card, ctx.sender());
}

// === Public-View Functions ===

public fun name(card: &Card): String {
    card.name
}

public fun img(card: &Card): String {
    card.img
}

public fun label(card: &Card): String {
    card.label
}

public fun points(card: &Card): u64 {
    card.points
}

public fun card_info(card: &Card): CardInfo {
    CardInfo {
        name: card.name,
        img: card.img,
        label: card.label,
        points: card.points,
    }
}

public fun all_cards(registry: &CardRegistry): vector<CardInfo> {
    registry.cards
}
