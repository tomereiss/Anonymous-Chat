from fastapi import APIRouter
import random

router = APIRouter()


@router.get("/generate-nickname")
def generate_nickname(num_options=3):
    animal_names = ['Lion', 'Tiger', 'Bear', 'Wolf', 'Fox', 'Eagle', 'Hawk', 'Shark', 'Panther', 'Cheetah', 'Dog',
                    'Cat', 'Hippo', 'Armadillo', 'Bat','Bug', 'Butterfly', 'Dolphin', 'Whale', 'Fish', 'Puma', 'Horse',
                    'Pinguin', 'Turtle', 'elephant', 'Lama', 'Koala', 'Deer', 'Pigeon', 'Dino', 'Mosquito', 'Zebra',
                    'Teo', 'Buffalo', 'Alligator']
    special_chars = ['!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '+', '-', '?', '~', '>', '<']
    nicknames = []

    for i in range(num_options):
        random_animal = random.choice(animal_names)
        random_number = random.randint(0, 9999)  # Generate a number from 0 to 9999
        random_char = random.choice(special_chars)
        generated_nickname = f"{random_animal}{random_number}{random_char}"
        nicknames.append(generated_nickname)
    return {"nicknames": nicknames}

