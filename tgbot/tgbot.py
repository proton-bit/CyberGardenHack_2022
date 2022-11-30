# Made by MISIShunters team.

import json
import shutil
import logging
import requests
import datetime

import pandas as pd
from geopy.geocoders import Nominatim
from aiogram import Bot, Dispatcher, executor, types

from moodle_functions import get_list_of_students
from moodle_functions import BASE_CODE as code

# Set an API_TOKEN.
API_TOKEN = '5840716578:AAGxtIgHFCwfF5vVvNnQpr0T4imJIV75XcE'

# Set a host.
url = 'http://127.0.0.1:8000/'

# Configure the logging.
logging.basicConfig(level=logging.INFO)

# Initialize a bot and a dispatcher.
bot = Bot(token=API_TOKEN)
dp = Dispatcher(bot)

# Initialize a geolocator.
geolocator = Nominatim(user_agent="geoapiExercises")

# Initializing the global variables.
ud = dict()  # Sessions' data.
with open('userdata.json', 'r', encoding='utf-8') as f: userdata = json.load(f)
with open('database.json', 'r', encoding='utf-8') as f: database = json.load(f)
with open('moodle_codes.json', 'r', encoding='utf-8') as f: moodle_codes = json.load(f)

# Encodings.
weekdays_encodings = {
    0: "Понедельник",
    1: "Вторник",
    2: "Среда",
    3: "Четверг",
    4: "Пятница",
    5: "Суббота",
    6: "Воскресенье",
}

# Initialize a journal.
df = pd.read_excel('schedule.xlsx')
keys = (df["День недели"] + "_" + df["Номер пары"].astype(str) + "_" + code).values
subjects = df[code].values
journal = dict()
for key, subject in zip(keys, subjects):
    journal[key] = {
        "предмет": subject, 
        "посещаемость": {
            i: 0 for i in get_list_of_students(moodle_codes[code])
        },
    }

del df, moodle_codes, keys, subject


def reformat_json(m: dict) -> dict:
    """Reformat journal before sending to backend."""
    journal = []

    for key, value in m.items():
        if "университет" not in value: continue

        journal.append({
            "university": value["университет"],
            "group": key.split("_")[2],
            "subject": value["предмет"],
            "date": value["дата"],
            "visiting": value["посещаемость"],
        })

    for _ in range(6 - len(journal)): journal.append(-1)
    return journal

# Bot's functions.

@dp.message_handler(commands=['start'])
async def start(message: types.Message) -> None:
    """Initializes a dialog."""
    global ud
    uid = str(message.from_id)

    # Reset the current state.
    ud[uid] = dict()
    ud[uid]["state"] = "start"
    ud[uid]["base_message"] = message

    # Upload user's data.
    if uid in userdata:
        ud[uid]["university"] = userdata[uid][2]
        ud[uid]["group"] = userdata[uid][1]
        ud[uid]["name"] = userdata[uid][0]

    # Create a keyboard.
    res = types.ReplyKeyboardMarkup(resize_keyboard=True,
                                    one_time_keyboard=False)
    res.add(types.KeyboardButton(text="✅ Отметиться на занятии"))

    # Reply to the user.
    await message.answer(text="Добро пожаловать! 👋 Чтобы отметиться на текущем занятии, "
                              "нажмите кнопку ниже.",
                         reply_markup=res)


@dp.message_handler(commands=['help'])
async def help_function(message: types.Message) -> None:
    """Initializes a dialog."""
    await message.answer(text="Привет! 👋 При помощи данного бота ты можешь"
                              " отметиться на занятии в один клик при помощи геолокации."
                              " Если ты здесь впервые, то сначала необходимо будет пройти"
                              " быструю авторизацию, указав свой университет, группу и имя. "
                              " Во время авторизации ты можешь начать сначала при помощи "
                              " команды /cancel.")


@dp.message_handler(content_types=['location'])
async def handle_location(message: types.Message) -> None:
    """Processes user's location."""
    global ud, journal
    uid = str(message.from_id)
    
    # Get the location.
    latitude = str(message.location.latitude)
    longitude = str(message.location.longitude)
    coordinates = geolocator.reverse(latitude + "," + longitude, language='en')
    address = coordinates.raw['address']
    location = address.get('amenity', '')
    if location.startswith('И'):  location = location[:7]

    # Determine a visit.
    visit = location == ud[uid]["university"]
    
    # Student is on lesson.
    if visit:
        # Get the date and time.
        ud[uid]["state"] = "start"
        hour = datetime.datetime.now().hour
        date = str(datetime.datetime.today()).split()[0]
        weekday = weekdays_encodings[datetime.datetime.today().weekday()]

        # Determine the number of a lesson.
        if 8 <= hour <= 10:
            num = 1
        elif 10 < hour <= 12:
            num = 2
        elif 12 < hour <= 14:
            num = 3
        elif 14 < hour <= 16:
            num = 4
        elif 16 < hour <= 18:
            num = 5
        else:
            num = "pass"

        # Count visit.
        weekday = "Понедельник"
        key = f'{weekday}_{num}_{ud[uid]["group"]}'

        # There is a lesson at the current moment.
        if key in journal:
            journal[key]["посещаемость"][ud[uid]["name"]] = 1
            journal[key]["дата"] = date
            journal[key]["университет"] = ud[uid]["university"]

            with open(r"D:\CyberGarden\backend\dataBase.json", 'w') as f:
                json.dump(reformat_json(journal), f)
            requests.post(url, data={'journal': 1})

            await message.answer(text="Посещение зачтено!")

        # There is no lesson at the current moment.
        else:
            await message.answer(text="В данный момент занятий у вашей группы нет. "
                                        "Попробуйте позже")

    # Student isn't on lesson.
    else:
        res = types.ReplyKeyboardMarkup(resize_keyboard=True,
                                            one_time_keyboard=True)
        res.add(types.KeyboardButton(text="📡 Поделиться местоположением",
                                        request_location=True))
        await message.answer(text="Ваша геолокация не совпадает с местом занятия. "
                                    "Можете попробовать снова.", reply_markup=res)

@dp.callback_query_handler()
async def process_callback(callback_query: types.CallbackQuery):
    """Handles button presses."""
    global ud
    callback_query = dict(callback_query)
    uid = str(callback_query["from"]["id"])
    message = ud[uid]["base_message"]
    message.text = callback_query["data"]
    await processing(message)


@dp.message_handler()
async def processing(message: types.Message) -> None:
    """Represents the dialog pipeline."""
    global ud, userdata, database
    uid = str(message.from_id)

    # User initialization.
    if uid not in ud:
        await start(message)

    # User authorization.
    elif uid not in userdata and ud[uid]["state"] == "start":
        ud[uid]["state"] = "university"

        await message.answer(text="Для того, чтобы отметиться на занятии, "
                                  "необходимо авторизоваться.")

        res = types.InlineKeyboardMarkup(resize_keyboard=True, one_time_keyboard=False)
        for university in database:
            res.add(types.InlineKeyboardButton(text=university, callback_data=university))
        await message.answer(text="Выберите свой университет из списка ниже.", reply_markup=res)

    # Saving user's university.
    elif ud[uid]["state"] == "university":
        if message.text in database:
            ud[uid]["university"] = message.text
            ud[uid]["state"] = "group"

            res = types.InlineKeyboardMarkup(resize_keyboard=True, one_time_keyboard=False)
            for group in database[message.text]:
                res.add(types.InlineKeyboardButton(text=group, callback_data=group))
            await message.answer(text="Введите свою академическую группу.", reply_markup=res)
        else:
            await message.answer(text="Данного университета не существует."
                                      " Выберите университет из существующих.")

    # Saving user's group.
    elif ud[uid]["state"] == "group":
        if message.text in database[ud[uid]["university"]]:
            ud[uid]["group"] = message.text
            ud[uid]["state"] = "name"

            res = types.InlineKeyboardMarkup(resize_keyboard=True, one_time_keyboard=False)
            for student in database[ud[uid]["university"]][message.text]:
                res.add(types.InlineKeyboardButton(text=student, callback_data=student))
            await message.answer(text="Введите свои фамилию и имя.", reply_markup=res)
        else:
            await message.answer(text="Данной академической группы не существует."
                                      "Введите группу повторно.")

    # Saving user's name.
    elif ud[uid]["state"] == "name":
        if message.text in database[ud[uid]["university"]][ud[uid]["group"]]:
            ud[uid]["name"] = message.text

            userdata[uid] = [message.text, ud[uid]["group"], ud[uid]["university"]]
            with open('userdata.json', 'w') as f:
                json.dump(userdata, f)

            res = types.ReplyKeyboardMarkup(resize_keyboard=True,
                                            one_time_keyboard=True)
            res.add(types.KeyboardButton(text="📡 Поделиться местоположением",
                                         request_location=True))
            await message.answer(text="Для того, чтобы отметиться на занятии, "
                                      "необходимо поделиться своим местоположением."
                                      " Для этого нажмите кнопку ниже.", reply_markup=res)
        else:
            await message.text(text="Такого ученика не существует в списке"
                                    "данной группы. Введите фамилию и имя повторно.")

    # User has already been authorized.
    else:
        res = types.ReplyKeyboardMarkup(resize_keyboard=True,
                                        one_time_keyboard=True)
        res.add(types.KeyboardButton(text="📡 Поделиться местоположением",
                                     request_location=True))
        await message.answer(text="Для того, чтобы отметиться на занятии, "
                                  "необходимо поделиться своим местоположением."
                                  " Для этого нажмите кнопку ниже.", reply_markup=res)


if __name__ == '__main__':
    # Launch the bot.
    executor.start_polling(dp, skip_updates=True)

    # Create a back up of a database.
    shutil.copy('userdata.json', 'userdata_backup.json')