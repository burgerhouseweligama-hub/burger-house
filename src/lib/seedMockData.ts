import Category from '@/models/Category';
import Product from '@/models/Product';

const MOCK_CATEGORIES = [
    { name: 'Burgers', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80' },
    { name: 'Hot Dogs', image: 'https://images.unsplash.com/photo-1619740455993-9e612b1af08a?w=800&q=80' },
    { name: 'Submarines', image: 'https://images.unsplash.com/photo-1549590143-d5855148a9d5?w=800&q=80' },
    { name: 'Sandwiches & Savoury Treats', image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=800&q=80' },
    { name: 'Roti Varieties', image: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=800&q=80' },
    { name: 'Devilled Dishes', image: 'https://images.unsplash.com/photo-1626200419188-f11155915dc1?w=800&q=80' },
    { name: 'Sides & Snacks', image: 'https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?w=800&q=80' },
    { name: 'Hoppers', image: 'https://images.unsplash.com/photo-1625938144755-652e08e359b7?w=800&q=80' },
    { name: 'Fried Rice Dishes', image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=800&q=80' },
    { name: 'Kottu Dishes', image: 'https://images.unsplash.com/photo-1613946069412-38f7f1ff0b65?w=800&q=80' },
    { name: 'Pasta Dishes', image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=800&q=80' },
    { name: 'Noodles Dishes', image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=800&q=80' },
    { name: 'Soup', image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800&q=80' },
    { name: 'Rice & Curry', image: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=800&q=80' },
    { name: 'Smoothie Bowls', image: 'https://images.unsplash.com/photo-1608930906233-1ec85c15db6a?w=800&q=80' }
];

const MENU_ITEMS = [
    // Burgers
    { name: 'Chicken Burger', description: 'Juicy seasoned chicken patty topped with a slice of melted cheese, fresh lettuce, tomato, and creamy mayo.', price: 1650.00, categoryName: 'Burgers', image: 'https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=800&q=80' },
    { name: 'Devilled Chicken Burger', description: 'A spicy twist! Chicken tossed in a fiery chili paste with onions and capsicum, balanced with a layer of creamy cheese.', price: 1350.00, categoryName: 'Burgers', image: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=800&q=80' },
    { name: 'Crispy Chicken Burger', description: 'Golden fried chicken fillet with a crunchy coating, topped with a slice of cheese and served with special sauce.', price: 1300.00, categoryName: 'Burgers', image: 'https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?w=800&q=80' },
    { name: 'Mushroom Burger', description: 'Sautéed fresh mushrooms paired with a generous layer of melted cheese and herbs.', price: 1000.00, categoryName: 'Burgers', image: 'https://images.unsplash.com/photo-1586816001966-79b736744398?w=800&q=80' },
    { name: 'Beef Burger', description: 'Premium succulent beef patty grilled to perfection, stacked with a delicious slice of cheese and fresh veggies.', price: 3000.00, categoryName: 'Burgers', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80' },
    { name: 'Crispy Fish Burger', description: 'Breaded fish fillet fried until golden brown, crowned with a melting cheese slice, crispy on the outside and soft inside.', price: 1600.00, categoryName: 'Burgers', image: 'https://images.unsplash.com/photo-1654452097728-601e38ffc17e?w=800&q=80' },
    { name: 'Vegetable Burger', description: 'A hearty patty made from fresh garden vegetables and mild spices.', price: 1000.00, categoryName: 'Burgers', image: 'https://images.unsplash.com/photo-1520072959219-c595dc870360?w=800&q=80' },
    { name: 'Vegetable Pachchi Burger', description: 'A unique, rustic savory vegetable blend with authentic local flavors.', price: 1100.00, categoryName: 'Burgers', image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=800&q=80' },

    // Hot Dogs
    { name: 'Regular Hot Dog', description: 'Classic grilled sausage in a soft bun with mustard and ketchup.', price: 850.00, categoryName: 'Hot Dogs', image: 'https://images.unsplash.com/photo-1619740455993-9e612b1af08a?w=800&q=80' },
    { name: 'Cheese & Chicken Hot Dog', description: 'Juicy chicken sausage topped with a generous layer of melted cheese.', price: 1100.00, categoryName: 'Hot Dogs', image: 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=800&q=80' },
    { name: 'Scrambled Hot Dog', description: 'Topped with fluffy scrambled eggs and sauce for a hearty bite.', price: 1000.00, categoryName: 'Hot Dogs', image: 'https://images.unsplash.com/photo-1634818462211-e6301fc3e5cc?w=800&q=80' },
    { name: 'Vegetable Hot Dog', description: 'A savory veggie filling/sausage made from fresh garden vegetables.', price: 900.00, categoryName: 'Hot Dogs', image: 'https://images.unsplash.com/photo-1585325701165-351af916e581?w=800&q=80' },

    // Submarines
    { name: 'Devilled Chicken Submarine', description: 'Long bun stuffed with spicy devilled chicken, onions, and crunchy veggies.', price: 1700.00, categoryName: 'Submarines', image: 'https://images.unsplash.com/photo-1549590143-d5855148a9d5?w=800&q=80' },
    { name: 'Crispy Chicken Submarine', description: 'Crunchy fried chicken strips packed into a fresh bun with creamy dressing.', price: 1600.00, categoryName: 'Submarines', image: 'https://images.unsplash.com/photo-1509722747041-616f39b57569?w=800&q=80' },
    { name: 'Pork Submarine', description: 'Juicy pork cooked in a rich savory sauce, topped with a layer of melted cheese and caramelized onions.', price: 2200.00, categoryName: 'Submarines', image: 'https://images.unsplash.com/photo-1619881589316-56c7f9e6b587?w=800&q=80' },

    // Sandwiches & Savoury Treats
    { name: 'Egg Sandwich', description: 'Egg spread with a dash of pepper between soft bread slices.', price: 500.00, categoryName: 'Sandwiches & Savoury Treats', image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=800&q=80' },
    { name: 'Chicken Sandwich', description: 'Shredded chicken mix with mayonnaise and crisp lettuce.', price: 700.00, categoryName: 'Sandwiches & Savoury Treats', image: 'https://images.unsplash.com/photo-1619096252214-ef06c45683e3?w=800&q=80' },
    { name: 'Egg & Chicken Sandwich', description: 'A filling combination of boiled eggs and seasoned chicken.', price: 1200.00, categoryName: 'Sandwiches & Savoury Treats', image: 'https://images.unsplash.com/photo-1554433607-66b5efe9d304?w=800&q=80' },
    { name: 'Cheese Sandwich', description: 'Classic cheddar cheese slices with a touch of butter.', price: 900.00, categoryName: 'Sandwiches & Savoury Treats', image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=800&q=80' },
    { name: 'Toast Bread & Fry Egg', description: 'Perfectly toasted bread served with a sunny-side-up egg.', price: 1300.00, categoryName: 'Sandwiches & Savoury Treats', image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=800&q=80' },
    { name: 'Egg & Sausages', description: 'A simple yet satisfying plate of fried eggs and grilled sausages.', price: 850.00, categoryName: 'Sandwiches & Savoury Treats', image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=800&q=80' },
    { name: 'Cheese & Sausages', description: 'Grilled sausages served with melted cheese.', price: 1000.00, categoryName: 'Sandwiches & Savoury Treats', image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=800&q=80' },
    { name: 'Scramble Egg & Bread', description: 'Soft, fluffy scrambled eggs served with fresh slices of bread.', price: 950.00, categoryName: 'Sandwiches & Savoury Treats', image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=800&q=80' },
    { name: 'Croque Monsieur', description: 'Grilled ham and cheese sandwich topped with creamy white sauce.', price: 1600.00, categoryName: 'Sandwiches & Savoury Treats', image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=800&q=80' },
    { name: 'Club Sandwich', description: 'A triple-decker classic stacked with chicken, cheese, fried egg, tomato, and crisp lettuce.', price: 2500.00, categoryName: 'Sandwiches & Savoury Treats', image: 'https://images.unsplash.com/photo-1567234669004-fbef06b297ea?w=800&q=80' },

    // Roti Varieties
    { name: 'Avocado Roti', description: 'Fresh roti filled with creamy, ripe avocado slices.', price: 650.00, categoryName: 'Roti Varieties', image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=800&q=80' },
    { name: 'Banana Roti', description: 'Sweet roti stuffed with fresh sliced bananas and sugar.', price: 550.00, categoryName: 'Roti Varieties', image: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=800&q=80' },
    { name: 'Banana Chocolate Roti', description: 'A dessert favorite featuring bananas and rich chocolate spread.', price: 650.00, categoryName: 'Roti Varieties', image: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=800&q=80' },
    { name: 'Chocolate Roti', description: 'Warm roti oozing with melted chocolate.', price: 350.00, categoryName: 'Roti Varieties', image: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=800&q=80' },
    { name: 'Cheese Roti', description: 'Stuffed with melted cheese for a savory treat.', price: 600.00, categoryName: 'Roti Varieties', image: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=800&q=80' },
    { name: 'Egg & Cheese Roti', description: 'A protein-packed roti with egg and gooey cheese.', price: 650.00, categoryName: 'Roti Varieties', image: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=800&q=80' },
    { name: 'Chicken & Cheese Roti', description: 'Spiced chicken filling with melted cheese.', price: 700.00, categoryName: 'Roti Varieties', image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800&q=80' },
    { name: 'Egg, Chicken & Cheese Roti', description: 'Egg and Spiced chicken filling with melted cheese.', price: 800.00, categoryName: 'Roti Varieties', image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800&q=80' },
    { name: 'Parata Roti', description: 'Plain, flaky, pan-grilled flatbread.', price: 100.00, categoryName: 'Roti Varieties', image: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=800&q=80' },
    { name: 'Parata with Dhal Curry', description: 'Flaky flatbread served with a side of creamy lentil curry.', price: 150.00, categoryName: 'Roti Varieties', image: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=800&q=80' },
    { name: 'Egg Roti', description: 'Folded roti cooked with an egg inside.', price: 220.00, categoryName: 'Roti Varieties', image: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=800&q=80' },
    { name: 'Egg Roti with Chicken Curry', description: 'Egg roti served with a side of spicy chicken gravy.', price: 400.00, categoryName: 'Roti Varieties', image: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=800&q=80' },
    { name: 'Chicken & Masala Roti', description: 'Stuffed with spicy masala chicken mix.', price: 650.00, categoryName: 'Roti Varieties', image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800&q=80' },
    { name: 'Coconut & Honey Roti', description: 'A sweet traditional treat with grated coconut and golden honey.', price: 500.00, categoryName: 'Roti Varieties', image: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=800&q=80' },
    { name: 'Shawarma', description: 'Middle-Eastern style wrap with spiced meat and garlic sauce.', price: 700.00, categoryName: 'Roti Varieties', image: 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=800&q=80' },
    { name: 'Coconut Roti 2', description: 'Freshly grilled flatbreads served with your choice of Dhal Curry, Seeni Sambal, or Katta Sambal.', price: 200.00, categoryName: 'Roti Varieties', image: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=800&q=80' },

    // Devilled Dishes
    { name: 'Devilled Chicken Dish', description: 'Fried chicken pieces tossed in a spicy chili sauce with crunchy onions and capsicum.', price: 1350.00, categoryName: 'Devilled Dishes', image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=800&q=80' },
    { name: 'Devilled Fish Dish', description: 'Crispy fish chunks coated in a hot and sweet chili paste with fresh veggies.', price: 1100.00, categoryName: 'Devilled Dishes', image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=800&q=80' },
    { name: 'Devilled Prawns Dish', description: 'Juicy prawns stir-fried in a fiery red sauce with tomato and spices.', price: 1800.00, categoryName: 'Devilled Dishes', image: 'https://images.unsplash.com/photo-1626200419188-f11155915dc1?w=800&q=80' },
    { name: 'Devilled Sausages Dish', description: 'Sliced sausages cooked in a rich, spicy gravy with plenty of onions.', price: 1400.00, categoryName: 'Devilled Dishes', image: 'https://images.unsplash.com/photo-1626200419188-f11155915dc1?w=800&q=80' },

    // Sides & Snacks
    { name: 'French Fries Chips', description: 'Golden, crispy potato fries lightly salted.', price: 600.00, categoryName: 'Sides & Snacks', image: 'https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?w=800&q=80' },

    // Hoppers
    { name: 'Plain Hopper', description: 'Classic crispy hopper with a soft and fluffy center.', price: 80.00, categoryName: 'Hoppers', image: 'https://images.unsplash.com/photo-1625938144755-652e08e359b7?w=800&q=80' },
    { name: 'Egg Hopper', description: 'Baked with a farm-fresh egg in the center, sprinkled with salt and pepper.', price: 200.00, categoryName: 'Hoppers', image: 'https://images.unsplash.com/photo-1625938144755-652e08e359b7?w=800&q=80' },
    { name: 'Cheese Hopper', description: 'Topped with a generous layer of melted cheese for a creamy taste.', price: 350.00, categoryName: 'Hoppers', image: 'https://images.unsplash.com/photo-1625938144755-652e08e359b7?w=800&q=80' },
    { name: 'Colour Hopper', description: 'A fun, vibrant hopper visually appealing for kids and adults alike.', price: 120.00, categoryName: 'Hoppers', image: 'https://images.unsplash.com/photo-1625938144755-652e08e359b7?w=800&q=80' },
    { name: 'Chocolate Hopper', description: 'A sweet twist! Crispy hopper swirled with rich melted chocolate.', price: 250.00, categoryName: 'Hoppers', image: 'https://images.unsplash.com/photo-1625938144755-652e08e359b7?w=800&q=80' },
    { name: 'Egg & Cheese Hopper', description: 'The ultimate savory combo of a soft egg topped with melted cheese.', price: 450.00, categoryName: 'Hoppers', image: 'https://images.unsplash.com/photo-1625938144755-652e08e359b7?w=800&q=80' },
    { name: 'Chocolate & Cheese Hopper', description: 'A unique mix of sweet chocolate and savory cheese.', price: 500.00, categoryName: 'Hoppers', image: 'https://images.unsplash.com/photo-1625938144755-652e08e359b7?w=800&q=80' },
    { name: 'Honey Hopper (Pani Appa)', description: 'Served warm with a drizzle of pure Kithul treacle.', price: 150.00, categoryName: 'Hoppers', image: 'https://images.unsplash.com/photo-1625938144755-652e08e359b7?w=800&q=80' },
    { name: 'Masala Hopper', description: 'Topped with a spicy mix of onions, chilies, and tomatoes.', price: 220.00, categoryName: 'Hoppers', image: 'https://images.unsplash.com/photo-1625938144755-652e08e359b7?w=800&q=80' },

    // Fried Rice Dishes
    { name: 'Vegetable Fried Rice', description: 'Stir-fried with fresh carrots, leeks, and cabbage.', price: 800.00, categoryName: 'Fried Rice Dishes', image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=800&q=80' },
    { name: 'Egg Fried Rice', description: 'Tossed with scrambled eggs and savory seasonings.', price: 1100.00, categoryName: 'Fried Rice Dishes', image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=800&q=80' },
    { name: 'Chicken Fried Rice', description: 'Loaded with tender chicken pieces and vegetables.', price: 1300.00, categoryName: 'Fried Rice Dishes', image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=800&q=80' },
    { name: 'Egg & Sausages Rice', description: 'A combo plate with fried rice, eggs, and sausages.', price: 1500.00, categoryName: 'Fried Rice Dishes', image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=800&q=80' },
    { name: 'Mix Fried Rice', description: 'The ultimate combo of chicken, egg, seafood, and sausages.', price: 1800.00, categoryName: 'Fried Rice Dishes', image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=800&q=80' },

    // Kottu Dishes
    { name: 'Vegetable Kottu', description: 'Mixed with fresh carrots, leeks, and cabbage.', price: 750.00, categoryName: 'Kottu Dishes', image: 'https://images.unsplash.com/photo-1613946069412-38f7f1ff0b65?w=800&q=80' },
    { name: 'Egg Kottu', description: 'Tossed with plenty of scrambled eggs and spices.', price: 1000.00, categoryName: 'Kottu Dishes', image: 'https://images.unsplash.com/photo-1613946069412-38f7f1ff0b65?w=800&q=80' },
    { name: 'Chicken Kottu', description: 'Loaded with spicy chicken curry and roast chicken pieces.', price: 1300.00, categoryName: 'Kottu Dishes', image: 'https://images.unsplash.com/photo-1613946069412-38f7f1ff0b65?w=800&q=80' },
    { name: 'Cheese Kottu', description: 'Smothered in melted cheese for a creamy, rich taste.', price: 1700.00, categoryName: 'Kottu Dishes', image: 'https://images.unsplash.com/photo-1613946069412-38f7f1ff0b65?w=800&q=80' },

    // Pasta Dishes
    { name: 'Egg Pasta', description: 'Stir-fried with scrambled eggs and mild spices.', price: 1000.00, categoryName: 'Pasta Dishes', image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=800&q=80' },
    { name: 'Chicken Pasta', description: 'Served with tender chicken chunks and tomato-base sauce.', price: 1350.00, categoryName: 'Pasta Dishes', image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=800&q=80' },
    { name: 'Cheese Pasta', description: 'Creamy pasta tossed in a rich cheese sauce.', price: 1700.00, categoryName: 'Pasta Dishes', image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=800&q=80' },

    // Noodles Dishes
    { name: 'Vegetable Noodles', description: 'Stir-fried with crunchy garden vegetables.', price: 1000.00, categoryName: 'Noodles Dishes', image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=800&q=80' },
    { name: 'Egg Noodles', description: 'Wok-tossed with eggs and seasoning.', price: 1100.00, categoryName: 'Noodles Dishes', image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=800&q=80' },
    { name: 'Chicken Noodles', description: 'A favorite! Noodles with savory chicken and veggies.', price: 1500.00, categoryName: 'Noodles Dishes', image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=800&q=80' },

    // Soup
    { name: 'Mushrooms Soup', description: 'Creamy soup made with fresh earthy mushrooms.', price: 1000.00, categoryName: 'Soup', image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800&q=80' },
    { name: 'Chicken & Egg Soup', description: 'A protein-packed clear soup with chicken and egg drops.', price: 1200.00, categoryName: 'Soup', image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800&q=80' },
    { name: 'Onion Soup', description: 'Savory broth with caramelized onions.', price: 650.00, categoryName: 'Soup', image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800&q=80' },
    { name: 'Vegetable Soup', description: 'Healthy clear soup loaded with mixed vegetables.', price: 650.00, categoryName: 'Soup', image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800&q=80' },

    // Rice & Curry
    { name: 'Vegetable Rice & Curry', description: 'A healthy spread of seasonal vegetable curries served with fresh rice.', price: 900.00, categoryName: 'Rice & Curry', image: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=800&q=80' },
    { name: 'Egg Rice & Curry', description: 'Classic rice and curry served with a spicy boiled or fried egg.', price: 950.00, categoryName: 'Rice & Curry', image: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=800&q=80' },
    { name: 'Fish Rice & Curry', description: 'Served with a fresh slice of fish cooked in a tangy traditional gravy.', price: 1000.00, categoryName: 'Rice & Curry', image: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=800&q=80' },
    { name: 'Chicken Rice & Curry', description: 'A hearty meal featuring tender chicken cooked in aromatic spices.', price: 1200.00, categoryName: 'Rice & Curry', image: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=800&q=80' },
    { name: 'Prawn Rice & Curry', description: 'A premium treat served with succulent prawns in a rich, spicy curry.', price: 1500.00, categoryName: 'Rice & Curry', image: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=800&q=80' },

    // Smoothie Bowls
    { name: 'Mango Jack (Vegan)', description: 'All time favourite with mango, jackfruit & banana, topped with granola, strawberries, starfruit & coconut.', price: 1300.00, categoryName: 'Smoothie Bowls', image: 'https://images.unsplash.com/photo-1608930906233-1ec85c15db6a?w=800&q=80' },
    { name: 'Beat Berry (Vegan)', description: 'Strawberries, blueberries, beetroot and banana blended into the magic, topped with granola & pomegranate.', price: 1350.00, categoryName: 'Smoothie Bowls', image: 'https://images.unsplash.com/photo-1608930906233-1ec85c15db6a?w=800&q=80' }
];

let seedingPromise: Promise<void> | null = null;

export async function seedMockData(): Promise<void> {
    if (seedingPromise) return seedingPromise;

    seedingPromise = (async () => {
        try {
            console.log('Seeding new Burger House categories...');
            const categoriesWithSlugs = MOCK_CATEGORIES.map(category => ({
                ...category,
                slug: category.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
            }));

            // Upsert categories to avoid duplicate key errors on re-runs
            const bulkOps = categoriesWithSlugs.map(cat => ({
                updateOne: {
                    filter: { slug: cat.slug },
                    update: { $setOnInsert: cat },
                    upsert: true
                }
            }));
            await Category.bulkWrite(bulkOps);

            // Fetch all categories (including previously existing ones)
            const allCategories = await Category.find({ slug: { $in: categoriesWithSlugs.map(c => c.slug) } });
            console.log(`✅ Seeded/verified ${allCategories.length} categories`);

            // Map category names to their MongoDB ObjectIds
            const categoryMap = new Map(allCategories.map(c => [c.name, c._id]));

            const productsToInsert = MENU_ITEMS.map(item => {
                const categoryId = categoryMap.get(item.categoryName);
                if (!categoryId) {
                    console.warn(`Category not found for item: ${item.name}`);
                }
                return {
                    name: item.name,
                    description: item.description,
                    price: item.price,
                    category: categoryId,
                    image: item.image,
                    isAvailable: true
                };
            }).filter(item => item.category); // Only keep items with valid categories

            console.log('Seeding Burger House menu items...');
            const productBulkOps = productsToInsert.map(item => ({
                updateOne: {
                    filter: { name: item.name, category: item.category },
                    update: { $setOnInsert: item },
                    upsert: true
                }
            }));
            await Product.bulkWrite(productBulkOps);
            console.log(`✅ Seeded/verified ${productsToInsert.length} menu items successfully!`);

        } catch (error) {
            console.error('Error seeding mock data:', error);
            seedingPromise = null;
        }
    })();

    return seedingPromise;
}