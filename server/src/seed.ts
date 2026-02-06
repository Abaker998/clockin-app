import db from './database';

const users = [
    { name: 'Alec', pin: '4510' },
    { name: 'Patrick', pin: '4242' },
    { name:  'Ben', pin: '9000' }
];

const insert = db.prepare('INSERT OR IGNORE INTO users (name, pin) VALUES (?,?)');

for (const user of users) {
    insert.run(user.name, user.pin);
    console.log(`Added user: ${user.name}`);
}

console.log('Done Seeding!');