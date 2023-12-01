# Використовуйте офіційний образ Node.js
FROM node

# Створіть та встановіть робочий каталог
WORKDIR /usr/src/app

# Копіюйте package.json та package-lock.json для використання кешу
COPY package*.json ./

# Встановіть залежності
RUN npm install

# Скопіюйте всі файли в поточний робочий каталог
COPY . .

# Запустіть команду для запуску додатку
CMD ["npm", "start"]
