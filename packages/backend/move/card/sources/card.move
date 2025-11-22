module card::card;

use std::string::String;
use sui::event::emit;

// === Structs ===

public struct Card has key, store {
    id: UID,
    name: String,
    img: String,
    label: String,
    points: u64,
}

// === Events ===

public struct EventCardCreated has copy, drop {
    card_id: ID,
}

// === Public Functions ===

#[allow(lint(self_transfer))]
public fun create(
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
