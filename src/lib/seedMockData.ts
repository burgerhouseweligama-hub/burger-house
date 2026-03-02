import Category from '@/models/Category';
import Product from '@/models/Product';

const MOCK_CATEGORIES = [
    { name: 'Burgers', image: 'https://res.cloudinary.com/dat1l3gbi/image/upload/v1772108438/burger-house/t2enxnujz6pbslfbitts.jpg' },
    { name: 'Hot Dogs', image: 'https://res.cloudinary.com/dat1l3gbi/image/upload/v1772108176/burger-house/zonrx8l5jpgprgiqkfit.jpg' },
    { name: 'Submarines', image: 'https://res.cloudinary.com/dat1l3gbi/image/upload/v1772108194/burger-house/zruedwfwfaet6uqo2cls.jpg' },
    { name: 'Sandwiches & Savoury Treats', image: 'https://res.cloudinary.com/dat1l3gbi/image/upload/v1772108206/burger-house/qeimjns18eenjojpfkkf.jpg' },
    { name: 'Roti Varieties', image: 'https://res.cloudinary.com/dat1l3gbi/image/upload/v1772108219/burger-house/zmsodv27ctjowd6u1eie.jpg' },
    { name: 'Devilled Dishes', image: 'https://res.cloudinary.com/dat1l3gbi/image/upload/v1772108241/burger-house/hcwwjqh2zcozk6jaicnc.jpg' },
    { name: 'Sides & Snacks', image: 'https://res.cloudinary.com/dat1l3gbi/image/upload/v1772108255/burger-house/wmasjnotsyps8zunskhx.jpg' },
    { name: 'Hoppers', image: 'https://res.cloudinary.com/dat1l3gbi/image/upload/v1772108277/burger-house/rtodbrxpsl3nrlkrt8ti.jpg' },
    { name: 'Fried Rice Dishes', image: 'https://res.cloudinary.com/dat1l3gbi/image/upload/v1772108313/burger-house/tgzhuruuceubflbn5ph7.jpg' },
    { name: 'Kottu Dishes', image: 'https://res.cloudinary.com/dat1l3gbi/image/upload/v1772108329/burger-house/jyifp1b9j3gin2eefblr.jpg' },
    { name: 'Pasta Dishes', image: 'https://res.cloudinary.com/dat1l3gbi/image/upload/v1772108345/burger-house/wnkqby64qfbnxyofd3sp.jpg' },
    { name: 'Noodles Dishes', image: 'https://res.cloudinary.com/dat1l3gbi/image/upload/v1772108323/burger-house/kfabrrqwfnln1vjfyuxf.jpg' },
    { name: 'Soup', image: 'https://res.cloudinary.com/dat1l3gbi/image/upload/v1772108387/burger-house/zzpv4zwvuayaxtultutx.jpg' },
    { name: 'Rice & Curry', image: 'https://res.cloudinary.com/dat1l3gbi/image/upload/v1772108403/burger-house/fizi5i1hzjiw9hma8znt.jpg' },
    { name: 'Smoothie Bowls', image: 'https://res.cloudinary.com/dat1l3gbi/image/upload/v1772108420/burger-house/ndjmjaq1vdqxjifae77s.jpg' }
];

const MENU_ITEMS = [
    // Burgers
    { name: 'Chicken Burger', description: 'Juicy seasoned chicken patty topped with a slice of melted cheese, fresh lettuce, tomato, and creamy mayo.', price: 1650.00, categoryName: 'Burgers', image: 'https://res.cloudinary.com/dat1l3gbi/image/upload/v1772324629/burger-house/jipbzrxjsbw7q8b1cyb7.png' },
    { name: 'Devilled Chicken Burger', description: 'A spicy twist! Chicken tossed in a fiery chili paste with onions and capsicum, balanced with a layer of creamy cheese.', price: 1350.00, categoryName: 'Burgers', image: 'https://res.cloudinary.com/dat1l3gbi/image/upload/v1772324690/burger-house/tibodxtf8rm3vlpnvfap.png' },
    { name: 'Crispy Chicken Burger', description: 'Golden fried chicken fillet with a crunchy coating, topped with a slice of cheese and served with special sauce.', price: 1300.00, categoryName: 'Burgers', image: 'https://res.cloudinary.com/dat1l3gbi/image/upload/v1772324720/burger-house/zepgpf7zm2uufmebtsb8.png' },
    { name: 'Mushroom Burger', description: 'Sautéed fresh mushrooms paired with a generous layer of melted cheese and herbs.', price: 1000.00, categoryName: 'Burgers', image: 'https://res.cloudinary.com/dat1l3gbi/image/upload/v1772324881/burger-house/zd3nxpe11dhbfv33idfz.png' },
    { name: 'Beef Burger', description: 'Premium succulent beef patty grilled to perfection, stacked with a delicious slice of cheese and fresh veggies.', price: 3000.00, categoryName: 'Burgers', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80' },
    { name: 'Crispy Fish Burger', description: 'Breaded fish fillet fried until golden brown, crowned with a melting cheese slice, crispy on the outside and soft inside.', price: 1600.00, categoryName: 'Burgers', image: 'https://res.cloudinary.com/dat1l3gbi/image/upload/v1772324943/burger-house/imruofl4qjpcakibtasz.png' },
    { name: 'Vegetable Burger', description: 'A hearty patty made from fresh garden vegetables and mild spices.', price: 1000.00, categoryName: 'Burgers', image: 'https://res.cloudinary.com/dat1l3gbi/image/upload/v1772324412/burger-house/xar146mqdiyigwrodvv2.png' },
    { name: 'Vegetable Pachchi Burger', description: 'A unique, rustic savory vegetable blend with authentic local flavors.', price: 1100.00, categoryName: 'Burgers', image: 'https://res.cloudinary.com/dat1l3gbi/image/upload/v1772324573/burger-house/n7x43w0wim4ct7vtvkq6.png' },

    // Hot Dogs
    { name: 'Regular Hot Dog', description: 'Classic grilled sausage in a soft bun with mustard and ketchup.', price: 850.00, categoryName: 'Hot Dogs', image: 'https://res.cloudinary.com/dat1l3gbi/image/upload/v1772325287/burger-house/xh5eqtokcvww6lbk4gbr.jpg' },
    { name: 'Cheese & Chicken Hot Dog', description: 'Juicy chicken sausage topped with a generous layer of melted cheese.', price: 1100.00, categoryName: 'Hot Dogs', image: 'https://res.cloudinary.com/dat1l3gbi/image/upload/v1772325441/burger-house/e9pjurwqlryzgvbfmd0w.jpg' },
    { name: 'Scrambled Hot Dog', description: 'Topped with fluffy scrambled eggs and sauce for a hearty bite.', price: 1000.00, categoryName: 'Hot Dogs', image: 'https://res.cloudinary.com/dat1l3gbi/image/upload/v1772325516/burger-house/kpe7pgdiiyles2xsmn5w.jpg' },
    { name: 'Vegetable Hot Dog', description: 'A savory veggie filling/sausage made from fresh garden vegetables.', price: 900.00, categoryName: 'Hot Dogs', image: 'https://res.cloudinary.com/dat1l3gbi/image/upload/v1772325546/burger-house/t2anutiqxsznhy28orpe.jpg' },

    // Submarines
    { name: 'Devilled Chicken Submarine', description: 'Long bun stuffed with spicy devilled chicken, onions, and crunchy veggies.', price: 1700.00, categoryName: 'Submarines', image: 'https://res.cloudinary.com/dat1l3gbi/image/upload/v1772329130/burger-house/ydfggs7tv2bw9hzvohod.jpg' },
    { name: 'Crispy Chicken Submarine', description: 'Crunchy fried chicken strips packed into a fresh bun with creamy dressing.', price: 1600.00, categoryName: 'Submarines', image: 'https://res.cloudinary.com/dat1l3gbi/image/upload/v1772329148/burger-house/ic379ekenyt7qoylcrbx.jpg' },
    { name: 'Pork Submarine', description: 'Juicy pork cooked in a rich savory sauce, topped with a layer of melted cheese and caramelized onions.', price: 2200.00, categoryName: 'Submarines', image: 'https://res.cloudinary.com/dat1l3gbi/image/upload/v1772329173/burger-house/upwzmbtefumzjzxqal39.jpg' },

    // Sandwiches & Savoury Treats
    { name: 'Egg Sandwich', description: 'Egg spread with a dash of pepper between soft bread slices.', price: 500.00, categoryName: 'Sandwiches & Savoury Treats', image: 'https://res.cloudinary.com/dat1l3gbi/image/upload/v1772325679/burger-house/vxn56epzovg7hitt8oah.jpg' },
    { name: 'Chicken Sandwich', description: 'Shredded chicken mix with mayonnaise and crisp lettuce.', price: 700.00, categoryName: 'Sandwiches & Savoury Treats', image: 'https://res.cloudinary.com/dat1l3gbi/image/upload/v1772325878/burger-house/pse4b6hqbr3ksft0mtyu.jpg' },
    { name: 'Egg & Chicken Sandwich', description: 'A filling combination of boiled eggs and seasoned chicken.', price: 1200.00, categoryName: 'Sandwiches & Savoury Treats', image: 'https://res.cloudinary.com/dat1l3gbi/image/upload/v1772325999/burger-house/xsdkqie7xg0bmtxawvak.jpg' },
    { name: 'Cheese Sandwich', description: 'Classic cheddar cheese slices with a touch of butter.', price: 900.00, categoryName: 'Sandwiches & Savoury Treats', image: 'https://res.cloudinary.com/dat1l3gbi/image/upload/v1772326122/burger-house/hryu6rkz5g1taod4vfcw.jpg' },
    { name: 'Toast Bread & Fry Egg', description: 'Perfectly toasted bread served with a sunny-side-up egg.', price: 1300.00, categoryName: 'Sandwiches & Savoury Treats', image: 'https://res.cloudinary.com/dat1l3gbi/image/upload/v1772326272/burger-house/hj2jseijunjqqnhyf1xq.jpg' },
    { name: 'Egg & Sausages', description: 'A simple yet satisfying plate of fried eggs and grilled sausages.', price: 850.00, categoryName: 'Sandwiches & Savoury Treats', image: 'https://res.cloudinary.com/dat1l3gbi/image/upload/v1772326353/burger-house/vccr88ivjvndbtzaotqe.jpg' },
    { name: 'Cheese & Sausages', description: 'Grilled sausages served with melted cheese.', price: 1000.00, categoryName: 'Sandwiches & Savoury Treats', image: 'https://res.cloudinary.com/dat1l3gbi/image/upload/v1772326386/burger-house/dmgmgyhuykfytxijjwhd.jpg' },
    { name: 'Scramble Egg & Bread', description: 'Soft, fluffy scrambled eggs served with fresh slices of bread.', price: 950.00, categoryName: 'Sandwiches & Savoury Treats', image: 'https://res.cloudinary.com/dat1l3gbi/image/upload/v1772326330/burger-house/hffxnqa6oq8wwi8nyf0k.jpg' },
    { name: 'Croque Monsieur', description: 'Grilled ham and cheese sandwich topped with creamy white sauce.', price: 1600.00, categoryName: 'Sandwiches & Savoury Treats', image: 'https://res.cloudinary.com/dat1l3gbi/image/upload/v1772326197/burger-house/ghhy93y7i04jdyig8gfm.jpg' },
    { name: 'Club Sandwich', description: 'A triple-decker classic stacked with chicken, cheese, fried egg, tomato, and crisp lettuce.', price: 2500.00, categoryName: 'Sandwiches & Savoury Treats', image: 'https://res.cloudinary.com/dat1l3gbi/image/upload/v1772326150/burger-house/ejk3yu5awnmmrtnz2p8o.jpg' },

    // Roti Varieties
    { name: 'Avocado Roti', description: 'Fresh roti filled with creamy, ripe avocado slices.', price: 650.00, categoryName: 'Roti Varieties', image: 'https://res.cloudinary.com/dat1l3gbi/image/upload/v1772327368/burger-house/mbpgjfokgq5cropin2r3.jpg' },
    { name: 'Banana Roti', description: 'Sweet roti stuffed with fresh sliced bananas and sugar.', price: 550.00, categoryName: 'Roti Varieties', image: 'https://res.cloudinary.com/dat1l3gbi/image/upload/v1772327409/burger-house/tfrb6hllrmypononhui8.jpg' },
    { name: 'Banana Chocolate Roti', description: 'A dessert favorite featuring bananas and rich chocolate spread.', price: 650.00, categoryName: 'Roti Varieties', image: 'https://res.cloudinary.com/dat1l3gbi/image/upload/v1772327453/burger-house/igbehqksjgzeu35oh60a.jpg' },
    { name: 'Chocolate Roti', description: 'Warm roti oozing with melted chocolate.', price: 350.00, categoryName: 'Roti Varieties', image: 'https://res.cloudinary.com/dat1l3gbi/image/upload/v1772327504/burger-house/c1gplfmr4q0jeuqbpxyj.jpg' },
    { name: 'Cheese Roti', description: 'Stuffed with melted cheese for a savory treat.', price: 600.00, categoryName: 'Roti Varieties', image: 'https://res.cloudinary.com/dat1l3gbi/image/upload/v1772328706/burger-house/hom80wnzmdspubt0uofh.jpg' },
    { name: 'Egg & Cheese Roti', description: 'A protein-packed roti with egg and gooey cheese.', price: 650.00, categoryName: 'Roti Varieties', image: 'https://res.cloudinary.com/dat1l3gbi/image/upload/v1772327582/burger-house/eu5x0sglbxgfyzjqkzlj.jpg' },
    { name: 'Chicken & Cheese Roti', description: 'Spiced chicken filling with melted cheese.', price: 700.00, categoryName: 'Roti Varieties', image: 'https://res.cloudinary.com/dat1l3gbi/image/upload/v1772327715/burger-house/dkrpoolzpx47b1jskc5r.jpg' },
    { name: 'Egg, Chicken & Cheese Roti', description: 'Egg and Spiced chicken filling with melted cheese.', price: 800.00, categoryName: 'Roti Varieties', image: 'https://res.cloudinary.com/dat1l3gbi/image/upload/v1772327759/burger-house/ci4grpus3w2wnuz9uhyb.jpg' },
    { name: 'Parata Roti', description: 'Plain, flaky, pan-grilled flatbread.', price: 100.00, categoryName: 'Roti Varieties', image: 'https://res.cloudinary.com/dat1l3gbi/image/upload/v1772327256/burger-house/j8fgxanklmapraed33nn.jpg' },
    { name: 'Parata with Dhal Curry', description: 'Flaky flatbread served with a side of creamy lentil curry.', price: 150.00, categoryName: 'Roti Varieties', image: 'https://res.cloudinary.com/dat1l3gbi/image/upload/v1772327819/burger-house/iqddampnusm3wn5yjwjx.jpg' },
    { name: 'Egg Roti', description: 'Folded roti cooked with an egg inside.', price: 220.00, categoryName: 'Roti Varieties', image: 'https://res.cloudinary.com/dat1l3gbi/image/upload/v1772327873/burger-house/icieir0th94myxkpzne4.jpg' },
    { name: 'Egg Roti with Chicken Curry', description: 'Egg roti served with a side of spicy chicken gravy.', price: 400.00, categoryName: 'Roti Varieties', image: 'https://res.cloudinary.com/dat1l3gbi/image/upload/v1772327318/burger-house/xqxqff2zfvmkwlwvx8sn.jpg' },
    { name: 'Chicken & Masala Roti', description: 'Stuffed with spicy masala chicken mix.', price: 650.00, categoryName: 'Roti Varieties', image: 'https://res.cloudinary.com/dat1l3gbi/image/upload/v1772328195/burger-house/diohzggxgjbq8l5y0gk1.jpg' },
    { name: 'Coconut & Honey Roti', description: 'A sweet traditional treat with grated coconut and golden honey.', price: 500.00, categoryName: 'Roti Varieties', image: 'https://res.cloudinary.com/dat1l3gbi/image/upload/v1772328255/burger-house/kzynwgfxa0uvkmy0xgok.jpg' },
    { name: 'Shawarma', description: 'Middle-Eastern style wrap with spiced meat and garlic sauce.', price: 700.00, categoryName: 'Roti Varieties', image: 'https://res.cloudinary.com/dat1l3gbi/image/upload/v1772328740/burger-house/myrkcivbabwoao7papcp.jpg' },
    { name: 'Coconut Roti 2', description: 'Freshly grilled flatbreads served with your choice of Dhal Curry, Seeni Sambal, or Katta Sambal.', price: 200.00, categoryName: 'Roti Varieties', image: 'https://res.cloudinary.com/dat1l3gbi/image/upload/v1772328380/burger-house/xlg7rxxgenukdfttskfi.jpg' },

    // Devilled Dishes
    { name: 'Devilled Chicken Dish', description: 'Fried chicken pieces tossed in a spicy chili sauce with crunchy onions and capsicum.', price: 1350.00, categoryName: 'Devilled Dishes', image: 'https://res.cloudinary.com/dat1l3gbi/image/upload/v1772381842/burger-house/djysfdeklfmhfx3e4ki7.jpg' },
    { name: 'Devilled Fish Dish', description: 'Crispy fish chunks coated in a hot and sweet chili paste with fresh veggies.', price: 1100.00, categoryName: 'Devilled Dishes', image: 'https://res.cloudinary.com/dat1l3gbi/image/upload/v1772381864/burger-house/anhqnkdgtdiizskgoiac.jpg' },
    { name: 'Devilled Prawns Dish', description: 'Juicy prawns stir-fried in a fiery red sauce with tomato and spices.', price: 1800.00, categoryName: 'Devilled Dishes', image: 'https://res.cloudinary.com/dat1l3gbi/image/upload/v1772381891/burger-house/n5fl9xuboq47az2oevtf.jpg' },
    { name: 'Devilled Sausages Dish', description: 'Sliced sausages cooked in a rich, spicy gravy with plenty of onions.', price: 1400.00, categoryName: 'Devilled Dishes', image: 'https://res.cloudinary.com/dat1l3gbi/image/upload/v1772381912/burger-house/rxnr0vilzqemzyvmaj9l.jpg' },

    // Sides & Snacks
    { name: 'French Fries Chips', description: 'Golden, crispy potato fries lightly salted.', price: 600.00, categoryName: 'Sides & Snacks', image: 'https://res.cloudinary.com/dat1l3gbi/image/upload/v1772381931/burger-house/jiolmcros4hyklmeuxdg.jpg' },

    // Hoppers
    { name: 'Plain Hopper', description: 'Classic crispy hopper with a soft and fluffy center.', price: 80.00, categoryName: 'Hoppers', image: 'https://res.cloudinary.com/dat1l3gbi/image/upload/v1772381953/burger-house/tezuympt3ozfwbdunq3d.jpg' },
    { name: 'Egg Hopper', description: 'Baked with a farm-fresh egg in the center, sprinkled with salt and pepper.', price: 200.00, categoryName: 'Hoppers', image: 'https://res.cloudinary.com/dat1l3gbi/image/upload/v1772381971/burger-house/lv8iziipahn2uvft14gx.jpg' },
    { name: 'Cheese Hopper', description: 'Topped with a generous layer of melted cheese for a creamy taste.', price: 350.00, categoryName: 'Hoppers', image: 'https://res.cloudinary.com/dat1l3gbi/image/upload/v1772382104/burger-house/hcgeaaxjobtsun218q3k.png' },
    { name: 'Colour Hopper', description: 'A fun, vibrant hopper visually appealing for kids and adults alike.', price: 120.00, categoryName: 'Hoppers', image: 'https://res.cloudinary.com/dat1l3gbi/image/upload/v1772382167/burger-house/kk5q0nrsiazhlrowvt4l.png' },
    { name: 'Chocolate Hopper', description: 'A sweet twist! Crispy hopper swirled with rich melted chocolate.', price: 250.00, categoryName: 'Hoppers', image: 'https://res.cloudinary.com/dat1l3gbi/image/upload/v1772382189/burger-house/llbkpwtdsb1hqxckcfhn.jpg' },
    { name: 'Egg & Cheese Hopper', description: 'The ultimate savory combo of a soft egg topped with melted cheese.', price: 450.00, categoryName: 'Hoppers', image: 'https://res.cloudinary.com/dat1l3gbi/image/upload/v1772382209/burger-house/gktkasulebmy3ba5i5j3.png' },
    { name: 'Chocolate & Cheese Hopper', description: 'A unique mix of sweet chocolate and savory cheese.', price: 500.00, categoryName: 'Hoppers', image: 'https://res.cloudinary.com/dat1l3gbi/image/upload/v1772382248/burger-house/vvoc0cmc3r7upjbj7bze.jpg' },
    { name: 'Honey Hopper (Pani Appa)', description: 'Served warm with a drizzle of pure Kithul treacle.', price: 150.00, categoryName: 'Hoppers', image: 'https://res.cloudinary.com/dat1l3gbi/image/upload/v1772382277/burger-house/car5rri4jhzcjaywls4p.jpg' },
    { name: 'Masala Hopper', description: 'Topped with a spicy mix of onions, chilies, and tomatoes.', price: 220.00, categoryName: 'Hoppers', image: 'https://res.cloudinary.com/dat1l3gbi/image/upload/v1772382298/burger-house/hvrce0ie5tyccq3xbla5.jpg' },

    // Fried Rice Dishes
    { name: 'Vegetable Fried Rice', description: 'Stir-fried with fresh carrots, leeks, and cabbage.', price: 800.00, categoryName: 'Fried Rice Dishes', image: 'https://res.cloudinary.com/dat1l3gbi/image/upload/v1772383335/burger-house/vgqjbbp0oxp43c3ll1hv.jpg' },
    { name: 'Egg Fried Rice', description: 'Tossed with scrambled eggs and savory seasonings.', price: 1100.00, categoryName: 'Fried Rice Dishes', image: 'https://res.cloudinary.com/dat1l3gbi/image/upload/v1772383370/burger-house/qn4if4yqcyyqpy4p2zr6.jpg' },
    { name: 'Chicken Fried Rice', description: 'Loaded with tender chicken pieces and vegetables.', price: 1300.00, categoryName: 'Fried Rice Dishes', image: 'https://res.cloudinary.com/dat1l3gbi/image/upload/v1772383788/burger-house/pner1ixmsh7qbk9gwhjd.png' },
    { name: 'Egg & Sausages Rice', description: 'A combo plate with fried rice, eggs, and sausages.', price: 1500.00, categoryName: 'Fried Rice Dishes', image: 'https://res.cloudinary.com/dat1l3gbi/image/upload/v1772383619/burger-house/v69vjniklchixxegvlcd.jpg' },
    { name: 'Mix Fried Rice', description: 'The ultimate combo of chicken, egg, seafood, and sausages.', price: 1800.00, categoryName: 'Fried Rice Dishes', image: 'https://res.cloudinary.com/dat1l3gbi/image/upload/v1772384020/burger-house/ahb0j0trymfgsykhz8on.jpg' },

    // Kottu Dishes
    { name: 'Vegetable Kottu', description: 'Mixed with fresh carrots, leeks, and cabbage.', price: 750.00, categoryName: 'Kottu Dishes', image: 'https://res.cloudinary.com/dat1l3gbi/image/upload/v1772383403/burger-house/l4ttreupmiwsqmhjdexr.jpg' },
    { name: 'Egg Kottu', description: 'Tossed with plenty of scrambled eggs and spices.', price: 1000.00, categoryName: 'Kottu Dishes', image: 'https://res.cloudinary.com/dat1l3gbi/image/upload/v1772384193/burger-house/cuyt2sber0ib8r4acioa.png' },
    { name: 'Chicken Kottu', description: 'Loaded with spicy chicken curry and roast chicken pieces.', price: 1300.00, categoryName: 'Kottu Dishes', image: 'https://res.cloudinary.com/dat1l3gbi/image/upload/v1772384102/burger-house/qp35aog721zkuhx70df1.jpg' },
    { name: 'Cheese Kottu', description: 'Smothered in melted cheese for a creamy, rich taste.', price: 1700.00, categoryName: 'Kottu Dishes', image: 'https://res.cloudinary.com/dat1l3gbi/image/upload/v1772384127/burger-house/g0oxz0c6ejihsxj0x1gm.jpg' },

    // Pasta Dishes
    { name: 'Egg Pasta', description: 'Stir-fried with scrambled eggs and mild spices.', price: 1000.00, categoryName: 'Pasta Dishes', image: 'https://res.cloudinary.com/dat1l3gbi/image/upload/v1772384157/burger-house/dz2lmlkvqhtuijlcytfh.jpg' },
    { name: 'Chicken Pasta', description: 'Served with tender chicken chunks and tomato-base sauce.', price: 1350.00, categoryName: 'Pasta Dishes', image: 'https://res.cloudinary.com/dat1l3gbi/image/upload/v1772384351/burger-house/gxrux02awtonsgqhqq42.png' },
    { name: 'Cheese Pasta', description: 'Creamy pasta tossed in a rich cheese sauce.', price: 1700.00, categoryName: 'Pasta Dishes', image: 'https://res.cloudinary.com/dat1l3gbi/image/upload/v1772384392/burger-house/xphpzzhz3duirxbfbimn.png' },

    // Noodles Dishes
    { name: 'Vegetable Noodles', description: 'Stir-fried with crunchy garden vegetables.', price: 1000.00, categoryName: 'Noodles Dishes', image: 'https://res.cloudinary.com/dat1l3gbi/image/upload/v1772384601/burger-house/imqtnmbfc0fozgfsyzzq.png' },
    { name: 'Egg Noodles', description: 'Wok-tossed with eggs and seasoning.', price: 1100.00, categoryName: 'Noodles Dishes', image: 'https://res.cloudinary.com/dat1l3gbi/image/upload/v1772384627/burger-house/qc2cr8rj3qovat0l4rds.png' },
    { name: 'Chicken Noodles', description: 'A favorite! Noodles with savory chicken and veggies.', price: 1500.00, categoryName: 'Noodles Dishes', image: 'https://res.cloudinary.com/dat1l3gbi/image/upload/v1772384667/burger-house/b7bws2examvz09pjpw28.jpg' },

    // Soup
    { name: 'Mushrooms Soup', description: 'Creamy soup made with fresh earthy mushrooms.', price: 1000.00, categoryName: 'Soup', image: 'https://res.cloudinary.com/dat1l3gbi/image/upload/v1772384820/burger-house/q2wiphzwvmq4aiyhqymb.jpg' },
    { name: 'Chicken & Egg Soup', description: 'A protein-packed clear soup with chicken and egg drops.', price: 1200.00, categoryName: 'Soup', image: 'https://res.cloudinary.com/dat1l3gbi/image/upload/v1772384882/burger-house/n6xtjzkqg9110vozkbby.jpg' },
    { name: 'Onion Soup', description: 'Savory broth with caramelized onions.', price: 650.00, categoryName: 'Soup', image: 'https://res.cloudinary.com/dat1l3gbi/image/upload/v1772384930/burger-house/s2wqn6mymhrxzyu5yr6z.png' },
    { name: 'Vegetable Soup', description: 'Healthy clear soup loaded with mixed vegetables.', price: 650.00, categoryName: 'Soup', image: 'https://res.cloudinary.com/dat1l3gbi/image/upload/v1772384957/burger-house/gdoulntpzanfgdcnjpgo.jpg' },

    // Rice & Curry
    { name: 'Vegetable Rice & Curry', description: 'A healthy spread of seasonal vegetable curries served with fresh rice.', price: 900.00, categoryName: 'Rice & Curry', image: 'https://res.cloudinary.com/dat1l3gbi/image/upload/v1772385321/burger-house/bszgxyfvk2vmssw3iqdo.png' },
    { name: 'Egg Rice & Curry', description: 'Classic rice and curry served with a spicy boiled or fried egg.', price: 950.00, categoryName: 'Rice & Curry', image: 'https://res.cloudinary.com/dat1l3gbi/image/upload/v1772385352/burger-house/r043ncnyhl2ejzpvni4d.jpg' },
    { name: 'Fish Rice & Curry', description: 'Served with a fresh slice of fish cooked in a tangy traditional gravy.', price: 1000.00, categoryName: 'Rice & Curry', image: 'https://res.cloudinary.com/dat1l3gbi/image/upload/v1772385375/burger-house/h0t2ufcvi96laswriszh.jpg' },
    { name: 'Chicken Rice & Curry', description: 'A hearty meal featuring tender chicken cooked in aromatic spices.', price: 1200.00, categoryName: 'Rice & Curry', image: 'https://res.cloudinary.com/dat1l3gbi/image/upload/v1772385400/burger-house/rwvkj6cmpxpwbuaedcm6.jpg' },
    { name: 'Prawn Rice & Curry', description: 'A premium treat served with succulent prawns in a rich, spicy curry.', price: 1500.00, categoryName: 'Rice & Curry', image: 'https://res.cloudinary.com/dat1l3gbi/image/upload/v1772385420/burger-house/ppxvnh3rhyvathchivjn.jpg' },

    // Smoothie Bowls
    { name: 'Mango Jack (Vegan)', description: 'All time favourite with mango, jackfruit & banana, topped with granola, strawberries, starfruit & coconut.', price: 1300.00, categoryName: 'Smoothie Bowls', image: 'https://res.cloudinary.com/dat1l3gbi/image/upload/v1772385899/burger-house/t7llfyftthsvxihxzxih.jpg' },
    { name: 'Beat Berry (Vegan)', description: 'Strawberries, blueberries, beetroot and banana blended into the magic, topped with granola & pomegranate.', price: 1350.00, categoryName: 'Smoothie Bowls', image: 'https://res.cloudinary.com/dat1l3gbi/image/upload/v1772385632/burger-house/rgay4adrbopo7cimwhoz.png' }
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
            }).filter(item => item.category);

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