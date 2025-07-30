const db = require('./database');

db.serialize(() => {
  // THE FIX: These lines delete all existing data first.
  db.run(`DELETE FROM toys`);
  db.run(`DELETE FROM food`);
  db.run(`DELETE FROM grooming_services`);
  console.log('✅ Emptied database before seeding new data.');
  // THE FIX ENDS HERE

  // 🧸 Toys
  const toys = [
    ['Sir Chews-a-Lot', 'dog', 'A rope chew toy for noble pups with boundless energy.', '/images/sir-chews-a-lot.png', 6.99, 50],
    ['The Bark Knight', 'dog', 'A squeaky bat-shaped toy for vigilante fetchers.', '/images/bark-knight.png', 8.49, 15],
    ['Sniff ‘n’ Shred', 'dog', 'Treat-dispensing toy with soft shreds.', '/images/sniff-n-shred.png', 6.20, 25],
    ['Laser Mayhem', 'cat', 'Auto-targeting laser for zoomie madness.', '/images/laser-mayham.png', 3.80, 66],
    ['Whisker Twister', 'cat', 'A crinkly toy that makes tails flip and kitties leap.', '/images/whisker-twister.png', 5.50, 70],
    ['Pounce-a-tron 3000', 'cat', 'Futuristic LED mouse for high-tech kitties.', '/images/pounce-a-tron.png', 9.25, 10]
  ];

  toys.forEach(([name, type, description, image_url, price, stock]) => {
    db.run(`INSERT INTO toys (name, type, description, image_url, price, stock) VALUES (?, ?, ?, ?, ?, ?)`,
      [name, type, description, image_url, price, stock]);
  });

  console.log('✅ Inserted toys');

  // 🍖 Dog Food
  const dogFood = [
    ['Bark-B-Q Ribs', 'dog', 'K9 Grillz', 'Smoky ribs-flavored dry food with tail-wagging vibes.', '/images/bark-ribs.png', 20.99, 20],
    ['Tail Wag Tacos', 'dog', 'Pupitos', 'Crunchy taco-shaped kibble with meaty goodness.', '/images/tacos.png', 22.75, 30],
    ['Pupperoni Deluxe', 'dog', 'GoodBoy Eats', 'Pizza-inspired food with extra chew.', '/images/pupperoni-deluxe.png', 21.49, 37],
    ['Howlin’ Hotpot', 'dog', 'SpicyPaws', 'For the bold barkers who love a flavor punch.', '/images/howlin-hotpot.png', 24.00, 28]
  ];

  // 🐟 Cat Food
  const catFood = [
    ['Paw Thai Curry', 'cat', 'SiamPaws', 'Mild chicken coconut curry for fancy felines.', '/images/paw-thai-curry.png', 23.25, 17],
    ['Feline Fettucine', 'cat', 'WhiskerChef', 'Pasta strips with fish & gravy.', '/images/feline-fettucine.png', 20.45, 27],
    ['Claw-some Casserole', 'cat', 'FancyFur', 'Layers of meat, rice, and snuggles.', '/images/claw-some-casserole.png', 21.00, 17]
  ];

  // Insert all food
  [...dogFood, ...catFood].forEach(([name, animal, brand, description, image_url, price, stock]) => {
    db.run(
      `INSERT INTO food (name, animal, brand, description, image_url, price, stock) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [name, animal, brand, description, image_url, price, stock]
    );
  });

  console.log('✅ Inserted food');

  // ✂️ Grooming Services
  const grooming = [
    ['Shed Happens', 'Deep clean, blowout, and de-shedding treatment', '/images/shed-happens.png', 40.00],
    ['The Floof Lift', 'Volume shampoo + fluff dry for max floof', '/images/floof-lift.png', 30.00],
    ['Mutt Makeover', 'Full groom with a bandana finish', '/images/mutt-makeover.png', 55.00],
    ['Nail It!', 'Nail trim + paw balm spa combo', '/images/nail-it.png', 15.00],
    ['Pawdicure Royale', 'Soak, scrub, trim, and stylish polish', '/images/pawdicure.png', 22.00]
  ];

  grooming.forEach(([name, description, image_url, price]) => {
    db.run(`INSERT INTO grooming_services (name, description, image_url, price) VALUES (?, ?, ?, ?)`, [name, description, image_url, price]);
  });

  console.log('✅ Inserted grooming');
});

console.log('🎉 Furpawtique database seeded successfully!');