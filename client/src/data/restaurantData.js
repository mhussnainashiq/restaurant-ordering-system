export const restaurantInfo = {
  name: 'SavorHub',
  tagline: 'Delicious food, delivered with love',
  phone: '+1 (555) 123-4567',
  email: 'hello@savorhub.com',
  address: '123 Food Street, Flavor City, FC 10001',
  openingHours: [
    { day: 'Monday - Friday', time: '10:00 AM - 10:00 PM' },
    { day: 'Saturday - Sunday', time: '11:00 AM - 11:00 PM' },
  ],
};

export const categories = [
  { id: 1, name: 'Burgers', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop', count: 12 },
  { id: 2, name: 'Pizza', image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&fit=crop', count: 8 },
  { id: 3, name: 'Chicken', image: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=400&h=300&fit=crop', count: 10 },
  { id: 4, name: 'Pasta', image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400&h=300&fit=crop', count: 7 },
  { id: 5, name: 'Drinks', image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400&h=300&fit=crop', count: 15 },
  { id: 6, name: 'Desserts', image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=400&h=300&fit=crop', count: 9 },
];

export const featuredDishes = [
  {
    id: 1,
    name: 'Classic Cheeseburger',
    description: 'Juicy beef patty with melted cheddar, lettuce, tomato & special sauce',
    price: 12.99,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&h=400&fit=crop',
    category: 'Burgers',
    popular: true,
  },
  {
    id: 2,
    name: 'Margherita Pizza',
    description: 'Fresh mozzarella, tomato sauce, basil and extra virgin olive oil',
    price: 14.50,
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&h=400&fit=crop',
    category: 'Pizza',
    popular: true,
  },
  {
    id: 3,
    name: 'Crispy Fried Chicken',
    description: 'Golden crispy chicken with our secret spices, served with fries',
    price: 13.99,
    image: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=500&h=400&fit=crop',
    category: 'Chicken',
    popular: true,
  },
  {
    id: 4,
    name: 'Creamy Alfredo Pasta',
    description: 'Fettuccine in rich creamy alfredo sauce with grilled chicken',
    price: 15.99,
    image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=500&h=400&fit=crop',
    category: 'Pasta',
    popular: false,
  },
];