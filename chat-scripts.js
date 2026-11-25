/* Speakora scripted chat practice ("Sara"). No AI, no API: plain data.
   HOW TO ADD A CONVERSATION: copy the object in the list, change id, title, level and chapters.
   Each chapter has steps. Each step: Sara says "bot" (+ "botAr"). The learner has exactly 3 opts, ONE with "ok": true.
   Other opts: "kind": "wrong" (has a mistake) or "weak" (understandable but incomplete or impolite),
   "fix" = the better English sentence, "hint" = short Egyptian-Arabic explanation.
   "end" = Sara's last line. Keep what follows the equals sign valid JSON. */
window.SPK_CHATS = [
 {
  "id": "hotel-desk",
  "title": "استقبال الفندق",
  "level": "A1-A2",
  "intro": "إنت ضيف في فندق بالم. سارة موظفة الاستقبال. اختار الرد الصح في كل مرة.",
  "chapters": [
   {
    "title": "الوصول",
    "steps": [
     {
      "bot": "Good evening! Welcome to the Palm Hotel. How can I help you?",
      "botAr": "مساء الخير! أهلاً بك في فندق بالم. أقدر أساعدك إزاي؟",
      "opts": [
       {
        "en": "Hello, I have a reservation.",
        "ar": "أهلاً، عندي حجز.",
        "ok": true
       },
       {
        "en": "Hello, I am have a reservation.",
        "ar": "أهلاً، أنا عندي حجز.",
        "kind": "wrong",
        "fix": "I have a reservation.",
        "hint": "مع have مبنقولش am. بنقول I have."
       },
       {
        "en": "Yes, reservation.",
        "ar": "أيوه، حجز.",
        "kind": "weak",
        "fix": "I have a reservation.",
        "hint": "مفهومة بس ناقصة. قول جملة كاملة."
       }
      ]
     },
     {
      "bot": "Of course. What is your name, please?",
      "botAr": "طبعاً. ممكن اسمك من فضلك؟",
      "opts": [
       {
        "en": "Me name is Ahmed Hassan.",
        "ar": "اسمي أحمد حسن.",
        "kind": "wrong",
        "fix": "My name is Ahmed Hassan.",
        "hint": "بنقول My مش Me."
       },
       {
        "en": "My name is Ahmed Hassan.",
        "ar": "اسمي أحمد حسن.",
        "ok": true
       },
       {
        "en": "Ahmed Hassan.",
        "ar": "أحمد حسن.",
        "kind": "weak",
        "fix": "My name is Ahmed Hassan.",
        "hint": "مفهومة، بس الأحسن تقول My name is قبل الاسم."
       }
      ]
     },
     {
      "bot": "Thank you, Mr. Hassan. I found your booking. How many nights will you stay?",
      "botAr": "شكراً يا أستاذ حسن. لقيت حجزك. هتقعد كام ليلة؟",
      "opts": [
       {
        "en": "I will stays for three nights.",
        "ar": "هقعد تلات ليالي.",
        "kind": "wrong",
        "fix": "I will stay for three nights.",
        "hint": "بعد will الفعل بيفضل زي ما هو من غير s."
       },
       {
        "en": "I will stay three night.",
        "ar": "هقعد تلات ليلة.",
        "kind": "wrong",
        "fix": "I will stay for three nights.",
        "hint": "مع أي رقم أكتر من واحد بنزود s: nights."
       },
       {
        "en": "I will stay for three nights.",
        "ar": "هقعد تلات ليالي.",
        "ok": true
       }
      ]
     },
     {
      "bot": "Great. Do you want a single room or a double room?",
      "botAr": "تمام. تحب أوضة فردية ولا مزدوجة؟",
      "opts": [
       {
        "en": "A double room, please.",
        "ar": "أوضة مزدوجة من فضلك.",
        "ok": true
       },
       {
        "en": "Give me double room.",
        "ar": "اديني أوضة مزدوجة.",
        "kind": "weak",
        "fix": "A double room, please.",
        "hint": "مفهومة بس مش مؤدبة. قول please وحط a قبل room."
       },
       {
        "en": "I am wanting a double room.",
        "ar": "أنا عايز أوضة مزدوجة.",
        "kind": "wrong",
        "fix": "I want a double room, please.",
        "hint": "want مبتتحطش مع am وing. بنقول I want."
       }
      ]
     },
     {
      "bot": "Can I see your passport, please?",
      "botAr": "ممكن أشوف جواز سفرك من فضلك؟",
      "opts": [
       {
        "en": "Yes, here are my passport.",
        "ar": "أيوه، ده جواز سفري.",
        "kind": "wrong",
        "fix": "Sure, here is my passport.",
        "hint": "الجواز واحد، فنقول is مش are."
       },
       {
        "en": "Sure, here is my passport.",
        "ar": "أكيد، ده جواز سفري.",
        "ok": true
       },
       {
        "en": "Take.",
        "ar": "خد.",
        "kind": "weak",
        "fix": "Sure, here is my passport.",
        "hint": "كلمة واحدة وناشفة. قول جملة مؤدبة."
       }
      ]
     },
     {
      "bot": "Thank you. Will you pay by cash or by card?",
      "botAr": "شكراً. هتدفع كاش ولا بالكارت؟",
      "opts": [
       {
        "en": "I will pay by a card.",
        "ar": "هدفع بالكارت.",
        "kind": "wrong",
        "fix": "I will pay by card.",
        "hint": "مع by بنقول card من غير a."
       },
       {
        "en": "Card.",
        "ar": "كارت.",
        "kind": "weak",
        "fix": "I will pay by card.",
        "hint": "قول جملة كاملة: I will pay by card."
       },
       {
        "en": "I will pay by card.",
        "ar": "هدفع بالكارت.",
        "ok": true
       }
      ]
     },
     {
      "bot": "Here is your key. Your room is on the fifth floor.",
      "botAr": "ده مفتاحك. أوضتك في الدور الخامس.",
      "opts": [
       {
        "en": "Thank you. Where is the elevator?",
        "ar": "شكراً. فين الأسانسير؟",
        "ok": true
       },
       {
        "en": "Thank you. Where the elevator is?",
        "ar": "شكراً. فين الأسانسير؟",
        "kind": "wrong",
        "fix": "Where is the elevator?",
        "hint": "في السؤال is بييجي قبل الكلمة: Where is the elevator."
       },
       {
        "en": "Elevator?",
        "ar": "الأسانسير؟",
        "kind": "weak",
        "fix": "Where is the elevator?",
        "hint": "كمّل السؤال: Where is the elevator."
       }
      ]
     },
     {
      "bot": "The elevator is next to the restaurant, on your left. Do you need help with your bags?",
      "botAr": "الأسانسير جنب المطعم على شمالك. محتاج مساعدة في الشنط؟",
      "opts": [
       {
        "en": "Yes, please. I have two bag.",
        "ar": "أيوه لو سمحت. معايا شنطتين.",
        "kind": "wrong",
        "fix": "I have two bags.",
        "hint": "أكتر من واحد بنزود s: bags."
       },
       {
        "en": "Yes, please. I have two bags.",
        "ar": "أيوه لو سمحت. معايا شنطتين.",
        "ok": true
       },
       {
        "en": "Yes. Bags.",
        "ar": "أيوه. شنط.",
        "kind": "weak",
        "fix": "Yes, please. I have two bags.",
        "hint": "كلمتين بس. قول جملة كاملة ومؤدبة."
       }
      ]
     },
     {
      "bot": "Of course. Our porter will bring them. Do you have any questions?",
      "botAr": "طبعاً. عامل الشنط هيطلعها. عندك أي أسئلة؟",
      "opts": [
       {
        "en": "Yes, when breakfast is?",
        "ar": "أيوه، الفطار امتى؟",
        "kind": "wrong",
        "fix": "What time is breakfast?",
        "hint": "في السؤال is بييجي قبل الكلمة: What time is breakfast."
       },
       {
        "en": "Breakfast?",
        "ar": "الفطار؟",
        "kind": "weak",
        "fix": "What time is breakfast?",
        "hint": "كلمة واحدة مش كفاية. اسأل سؤال كامل."
       },
       {
        "en": "Yes, what time is breakfast?",
        "ar": "أيوه، الفطار الساعة كام؟",
        "ok": true
       }
      ]
     },
     {
      "bot": "Breakfast is from seven to ten in the morning, on the first floor.",
      "botAr": "الفطار من سبعة لعشرة الصبح، في الدور الأول.",
      "opts": [
       {
        "en": "Thank you very much. Have a nice evening!",
        "ar": "شكراً جزيلاً. أمسية سعيدة!",
        "ok": true
       },
       {
        "en": "Thanks you very much. Have nice evening!",
        "ar": "شكراً جزيلاً. أمسية سعيدة!",
        "kind": "wrong",
        "fix": "Thank you very much. Have a nice evening!",
        "hint": "بنقول Thank you أو Thanks، مش Thanks you. وحط a قبل nice."
       },
       {
        "en": "Ok.",
        "ar": "تمام.",
        "kind": "weak",
        "fix": "Thank you very much. Have a nice evening!",
        "hint": "تمام لوحدها ناشفة. اشكرها بجملة."
       }
      ]
     }
    ]
   },
   {
    "title": "الأوضة",
    "steps": [
     {
      "bot": "Reception, this is Sara. How can I help you?",
      "botAr": "الاستقبال، أنا سارة. أقدر أساعدك إزاي؟",
      "opts": [
       {
        "en": "Hello, I am room 502.",
        "ar": "أهلاً، أنا أوضة 502.",
        "kind": "wrong",
        "fix": "Hello, this is room 502.",
        "hint": "في التليفون بنقول This is مش I am."
       },
       {
        "en": "Hello, this is room 502.",
        "ar": "أهلاً، دي أوضة 502.",
        "ok": true
       },
       {
        "en": "502.",
        "ar": "502.",
        "kind": "weak",
        "fix": "Hello, this is room 502.",
        "hint": "رقم لوحده مش كفاية. قول جملة."
       }
      ]
     },
     {
      "bot": "Hello, Mr. Hassan. What do you need?",
      "botAr": "أهلاً يا أستاذ حسن. محتاج إيه؟",
      "opts": [
       {
        "en": "The air conditioner not work.",
        "ar": "التكييف مش شغال.",
        "kind": "wrong",
        "fix": "The air conditioner does not work.",
        "hint": "النفي بيحتاج does not قبل work."
       },
       {
        "en": "Air conditioner bad.",
        "ar": "التكييف وحش.",
        "kind": "weak",
        "fix": "The air conditioner does not work.",
        "hint": "مفهومة بس ناقصة. قول المشكلة بجملة كاملة."
       },
       {
        "en": "The air conditioner does not work.",
        "ar": "التكييف مش شغال.",
        "ok": true
       }
      ]
     },
     {
      "bot": "I am sorry about that. Is it too hot or too cold?",
      "botAr": "أنا آسفة. الجو حر قوي ولا برد قوي؟",
      "opts": [
       {
        "en": "It is too hot in the room.",
        "ar": "الجو حر قوي في الأوضة.",
        "ok": true
       },
       {
        "en": "It has too hot in the room.",
        "ar": "الجو حر قوي في الأوضة.",
        "kind": "wrong",
        "fix": "It is too hot in the room.",
        "hint": "مع الصفات بنقول is مش has."
       },
       {
        "en": "Hot.",
        "ar": "حر.",
        "kind": "weak",
        "fix": "It is too hot in the room.",
        "hint": "كلمة واحدة. كمّل: It is too hot."
       }
      ]
     },
     {
      "bot": "We will send a technician now. Does the TV work?",
      "botAr": "هنبعت فني دلوقتي. التلفزيون شغال؟",
      "opts": [
       {
        "en": "Yes, the TV work well.",
        "ar": "أيوه، التلفزيون شغال كويس.",
        "kind": "wrong",
        "fix": "Yes, the TV works well.",
        "hint": "التلفزيون واحد، فالفعل ياخد s: works."
       },
       {
        "en": "Yes, the TV works well.",
        "ar": "أيوه، التلفزيون شغال كويس.",
        "ok": true
       },
       {
        "en": "Yes.",
        "ar": "أيوه.",
        "kind": "weak",
        "fix": "Yes, the TV works well.",
        "hint": "أيوه لوحدها تنفع، بس الأحسن تزود جملة."
       }
      ]
     },
     {
      "bot": "Good. Do you need anything else for the room?",
      "botAr": "حلو. محتاج أي حاجة تانية للأوضة؟",
      "opts": [
       {
        "en": "Yes, I need more towel, please.",
        "ar": "أيوه، محتاج فوط زيادة لو سمحت.",
        "kind": "wrong",
        "fix": "I need more towels, please.",
        "hint": "فوط كتير، فنقول towels بـ s."
       },
       {
        "en": "Towels.",
        "ar": "فوط.",
        "kind": "weak",
        "fix": "Yes, I need more towels, please.",
        "hint": "كلمة واحدة. اطلب بجملة مؤدبة."
       },
       {
        "en": "Yes, I need more towels, please.",
        "ar": "أيوه، محتاج فوط زيادة لو سمحت.",
        "ok": true
       }
      ]
     },
     {
      "bot": "Of course. Do you want a hairdryer too?",
      "botAr": "طبعاً. عايز سشوار كمان؟",
      "opts": [
       {
        "en": "No, thank you. I do not need it.",
        "ar": "لا، شكراً. مش محتاجه.",
        "ok": true
       },
       {
        "en": "No, thank you. I not need it.",
        "ar": "لا، شكراً. مش محتاجه.",
        "kind": "wrong",
        "fix": "I do not need it.",
        "hint": "النفي بيحتاج do not قبل need."
       },
       {
        "en": "No.",
        "ar": "لا.",
        "kind": "weak",
        "fix": "No, thank you. I do not need it.",
        "hint": "لا لوحدها ناشفة. زود thank you."
       }
      ]
     },
     {
      "bot": "Would you like us to clean your room today?",
      "botAr": "تحب ننضف أوضتك النهاردة؟",
      "opts": [
       {
        "en": "Yes, please clean it on the morning.",
        "ar": "أيوه، نضفوها الصبح.",
        "kind": "wrong",
        "fix": "Yes, please clean it in the morning.",
        "hint": "الصبح بنقول in the morning مش on."
       },
       {
        "en": "Yes, please clean it in the morning.",
        "ar": "أيوه، نضفوها الصبح لو سمحتوا.",
        "ok": true
       },
       {
        "en": "Yes, morning.",
        "ar": "أيوه، الصبح.",
        "kind": "weak",
        "fix": "Yes, please clean it in the morning.",
        "hint": "مفهومة بس ناقصة. قول جملة كاملة."
       }
      ]
     },
     {
      "bot": "What time in the morning?",
      "botAr": "الساعة كام الصبح؟",
      "opts": [
       {
        "en": "In nine o'clock, please.",
        "ar": "الساعة تسعة لو سمحتوا.",
        "kind": "wrong",
        "fix": "At nine o'clock, please.",
        "hint": "الساعة بنقول at مش in."
       },
       {
        "en": "Nine.",
        "ar": "تسعة.",
        "kind": "weak",
        "fix": "After nine o'clock, please.",
        "hint": "رقم لوحده. قول At nine o'clock, please."
       },
       {
        "en": "After nine o'clock, please.",
        "ar": "بعد التسعة لو سمحتوا.",
        "ok": true
       }
      ]
     },
     {
      "bot": "Perfect. Is the room quiet enough for you?",
      "botAr": "تمام. الأوضة هادية كفاية ليك؟",
      "opts": [
       {
        "en": "Yes, but I hear noise from the street.",
        "ar": "أيوه، بس بسمع دوشة من الشارع.",
        "ok": true
       },
       {
        "en": "Yes, but I am hear noise from street.",
        "ar": "أيوه، بس بسمع دوشة من الشارع.",
        "kind": "wrong",
        "fix": "Yes, but I hear noise from the street.",
        "hint": "مفيش am قبل hear. وحط the قبل street."
       },
       {
        "en": "Yes, noise.",
        "ar": "أيوه، دوشة.",
        "kind": "weak",
        "fix": "Yes, but I hear noise from the street.",
        "hint": "مفهومة بس ناقصة. اشرح المشكلة بجملة."
       }
      ]
     },
     {
      "bot": "I can move you to a quiet room. Do you want to change?",
      "botAr": "ممكن أنقلك لأوضة هادية. تحب تغيّر؟",
      "opts": [
       {
        "en": "No, thank you. This room are fine.",
        "ar": "لا، شكراً. الأوضة دي كويسة.",
        "kind": "wrong",
        "fix": "This room is fine.",
        "hint": "room واحدة، فنقول is مش are."
       },
       {
        "en": "No, thank you. This room is fine.",
        "ar": "لا، شكراً. الأوضة دي كويسة.",
        "ok": true
       },
       {
        "en": "No.",
        "ar": "لا.",
        "kind": "weak",
        "fix": "No, thank you. This room is fine.",
        "hint": "لا لوحدها ناشفة. زود thank you."
       }
      ]
     }
    ]
   },
   {
    "title": "الأكل والخدمات",
    "steps": [
     {
      "bot": "Good morning, Mr. Hassan! Did you sleep well?",
      "botAr": "صباح الخير يا أستاذ حسن! نمت كويس؟",
      "opts": [
       {
        "en": "Yes, I sleeped very well, thank you.",
        "ar": "أيوه، نمت كويس جداً.",
        "kind": "wrong",
        "fix": "I slept very well.",
        "hint": "sleep فعل شاذ. ماضيه slept مش sleeped."
       },
       {
        "en": "Yes.",
        "ar": "أيوه.",
        "kind": "weak",
        "fix": "Yes, I slept very well, thank you.",
        "hint": "أيوه لوحدها تنفع، بس زود جملة."
       },
       {
        "en": "Yes, I slept very well, thank you.",
        "ar": "أيوه، نمت كويس جداً، شكراً.",
        "ok": true
       }
      ]
     },
     {
      "bot": "Great! Breakfast is ready. Would you like tea or coffee?",
      "botAr": "حلو! الفطار جاهز. تحب شاي ولا قهوة؟",
      "opts": [
       {
        "en": "Coffee with milk, please.",
        "ar": "قهوة بلبن لو سمحت.",
        "ok": true
       },
       {
        "en": "Coffee with the milk, please.",
        "ar": "قهوة باللبن لو سمحت.",
        "kind": "wrong",
        "fix": "Coffee with milk, please.",
        "hint": "مع milk في الطلب العام مبنحطش the."
       },
       {
        "en": "Coffee.",
        "ar": "قهوة.",
        "kind": "weak",
        "fix": "Coffee with milk, please.",
        "hint": "كلمة واحدة. قول please وكمّل الطلب."
       }
      ]
     },
     {
      "bot": "Here you are. Do you want eggs, cheese or beans?",
      "botAr": "اتفضل. تحب بيض ولا جبنة ولا فول؟",
      "opts": [
       {
        "en": "I like eggs and cheese, please.",
        "ar": "أنا بحب بيض وجبنة.",
        "kind": "wrong",
        "fix": "I would like eggs and cheese, please.",
        "hint": "للطلب المؤدب بنقول I would like مش I like."
       },
       {
        "en": "I would like eggs and cheese, please.",
        "ar": "أحب بيض وجبنة لو سمحت.",
        "ok": true
       },
       {
        "en": "Eggs.",
        "ar": "بيض.",
        "kind": "weak",
        "fix": "I would like eggs and cheese, please.",
        "hint": "كلمة واحدة. اطلب بجملة مؤدبة."
       }
      ]
     },
     {
      "bot": "Anything to drink with it?",
      "botAr": "أي حاجة تشربها معاه؟",
      "opts": [
       {
        "en": "One glass from orange juice, please.",
        "ar": "كوباية عصير برتقال لو سمحت.",
        "kind": "wrong",
        "fix": "A glass of orange juice, please.",
        "hint": "بنقول a glass of مش from."
       },
       {
        "en": "Juice.",
        "ar": "عصير.",
        "kind": "weak",
        "fix": "A glass of orange juice, please.",
        "hint": "كلمة واحدة. قول a glass of orange juice, please."
       },
       {
        "en": "A glass of orange juice, please.",
        "ar": "كوباية عصير برتقال لو سمحت.",
        "ok": true
       }
      ]
     },
     {
      "bot": "Of course. How is the food?",
      "botAr": "طبعاً. الأكل عامل إيه؟",
      "opts": [
       {
        "en": "It is delicious, thank you.",
        "ar": "لذيذ، شكراً.",
        "ok": true
       },
       {
        "en": "It delicious, thank you.",
        "ar": "لذيذ، شكراً.",
        "kind": "wrong",
        "fix": "It is delicious.",
        "hint": "لازم is قبل الصفة: It is delicious."
       },
       {
        "en": "Good.",
        "ar": "حلو.",
        "kind": "weak",
        "fix": "It is delicious, thank you.",
        "hint": "مفهومة بس بسيطة قوي. قول It is delicious."
       }
      ]
     },
     {
      "bot": "I am glad. Do you want to visit the city today?",
      "botAr": "أنا مبسوطة. تحب تزور المدينة النهاردة؟",
      "opts": [
       {
        "en": "Yes, I want visit the museum.",
        "ar": "أيوه، عايز أزور المتحف.",
        "kind": "wrong",
        "fix": "I want to visit the museum.",
        "hint": "بعد want بنحط to قبل الفعل."
       },
       {
        "en": "Yes, I want to visit the museum.",
        "ar": "أيوه، عايز أزور المتحف.",
        "ok": true
       },
       {
        "en": "Yes, museum.",
        "ar": "أيوه، المتحف.",
        "kind": "weak",
        "fix": "Yes, I want to visit the museum.",
        "hint": "مفهومة بس ناقصة. قول جملة كاملة."
       }
      ]
     },
     {
      "bot": "Nice idea. It opens at nine. You can take a taxi.",
      "botAr": "فكرة حلوة. بيفتح الساعة تسعة. ممكن تاخد تاكسي.",
      "opts": [
       {
        "en": "How many is a taxi to the museum?",
        "ar": "التاكسي بكام؟",
        "kind": "wrong",
        "fix": "How much is a taxi to the museum?",
        "hint": "السعر بنسأل عنه How much مش How many."
       },
       {
        "en": "Taxi price?",
        "ar": "سعر التاكسي؟",
        "kind": "weak",
        "fix": "How much is a taxi to the museum?",
        "hint": "مفهومة بس ناقصة. اسأل سؤال كامل."
       },
       {
        "en": "How much is a taxi to the museum?",
        "ar": "التاكسي للمتحف بكام؟",
        "ok": true
       }
      ]
     },
     {
      "bot": "About fifty riyals. Do you need a map?",
      "botAr": "حوالي خمسين ريال. محتاج خريطة؟",
      "opts": [
       {
        "en": "Yes, please. Can I have a map?",
        "ar": "أيوه لو سمحت. ممكن آخد خريطة؟",
        "ok": true
       },
       {
        "en": "Yes, please. Can I to have a map?",
        "ar": "ممكن آخد خريطة؟",
        "kind": "wrong",
        "fix": "Can I have a map?",
        "hint": "بعد can الفعل من غير to."
       },
       {
        "en": "Map.",
        "ar": "خريطة.",
        "kind": "weak",
        "fix": "Yes, please. Can I have a map?",
        "hint": "كلمة واحدة. اطلب بجملة."
       }
      ]
     },
     {
      "bot": "Here is a map. The museum is near the big mosque. Do you want a taxi now?",
      "botAr": "اتفضل الخريطة. المتحف جنب الجامع الكبير. تحب تاكسي دلوقتي؟",
      "opts": [
       {
        "en": "Yes, please calling a taxi for me.",
        "ar": "اطلبي لي تاكسي.",
        "kind": "wrong",
        "fix": "Yes, please call a taxi for me.",
        "hint": "بعد please الفعل بسيط: call."
       },
       {
        "en": "Yes, please call a taxi for me.",
        "ar": "أيوه، اطلبي لي تاكسي لو سمحتي.",
        "ok": true
       },
       {
        "en": "Taxi now.",
        "ar": "تاكسي دلوقتي.",
        "kind": "weak",
        "fix": "Yes, please call a taxi for me.",
        "hint": "مفهومة بس مش مؤدبة. قول please."
       }
      ]
     },
     {
      "bot": "Sure. Your taxi will be here in ten minutes.",
      "botAr": "أكيد. التاكسي هيوصل بعد عشر دقايق.",
      "opts": [
       {
        "en": "Thank you. I will waiting in the lobby.",
        "ar": "شكراً. هستنى في اللوبي.",
        "kind": "wrong",
        "fix": "I will wait in the lobby.",
        "hint": "بعد will الفعل بسيط من غير ing."
       },
       {
        "en": "Ok, lobby.",
        "ar": "تمام، اللوبي.",
        "kind": "weak",
        "fix": "Thank you. I will wait in the lobby.",
        "hint": "مفهومة بس ناقصة. اشكرها وقول جملة."
       },
       {
        "en": "Thank you. I will wait in the lobby.",
        "ar": "شكراً. هستنى في اللوبي.",
        "ok": true
       }
      ]
     }
    ]
   },
   {
    "title": "مشاكل وطلبات",
    "steps": [
     {
      "bot": "Welcome back, Mr. Hassan. Did you enjoy the museum?",
      "botAr": "أهلاً بعودتك يا أستاذ حسن. استمتعت بالمتحف؟",
      "opts": [
       {
        "en": "Yes, it was very interesting.",
        "ar": "أيوه، كان مشوق جداً.",
        "ok": true
       },
       {
        "en": "Yes, it is very interesting.",
        "ar": "أيوه، هو مشوق جداً.",
        "kind": "wrong",
        "fix": "Yes, it was very interesting.",
        "hint": "ده حصل في الماضي فنقول was مش is."
       },
       {
        "en": "Yes.",
        "ar": "أيوه.",
        "kind": "weak",
        "fix": "Yes, it was very interesting.",
        "hint": "أيوه لوحدها تنفع، بس قول رأيك بجملة."
       }
      ]
     },
     {
      "bot": "I am happy to hear that. Is everything okay?",
      "botAr": "أنا مبسوطة إني سمعت كده. كله تمام؟",
      "opts": [
       {
        "en": "Not really. My key card doesn't opens the door.",
        "ar": "كارت المفتاح مش بيفتح الباب.",
        "kind": "wrong",
        "fix": "My key card doesn't open the door.",
        "hint": "بعد doesn't الفعل من غير s."
       },
       {
        "en": "Not really. My key card does not open the door.",
        "ar": "مش أوي. كارت المفتاح مش بيفتح الباب.",
        "ok": true
       },
       {
        "en": "Key problem.",
        "ar": "مشكلة المفتاح.",
        "kind": "weak",
        "fix": "Not really. My key card does not open the door.",
        "hint": "مفهومة بس ناقصة. اشرح المشكلة بجملة."
       }
      ]
     },
     {
      "bot": "I am sorry. Let me make a new key. Which room are you in?",
      "botAr": "آسفة. هعملك مفتاح جديد. إنت في أنهي أوضة؟",
      "opts": [
       {
        "en": "I stay in room 502.",
        "ar": "أنا ساكن في أوضة 502.",
        "kind": "wrong",
        "fix": "I am in room 502.",
        "hint": "للمكان دلوقتي بنقول I am in. stay معناها بتقعد فترة."
       },
       {
        "en": "502.",
        "ar": "502.",
        "kind": "weak",
        "fix": "I am in room 502.",
        "hint": "رقم لوحده. قول جملة."
       },
       {
        "en": "I am in room 502.",
        "ar": "أنا في أوضة 502.",
        "ok": true
       }
      ]
     },
     {
      "bot": "Here is your new key. Please do not give it to anyone.",
      "botAr": "ده مفتاحك الجديد. من فضلك متديهوش لأي حد.",
      "opts": [
       {
        "en": "Okay, I understand. Thank you.",
        "ar": "تمام، فاهم. شكراً.",
        "ok": true
       },
       {
        "en": "Okay, I am understand. Thank you.",
        "ar": "تمام، فاهم.",
        "kind": "wrong",
        "fix": "I understand.",
        "hint": "understand فعل لوحده من غير am."
       },
       {
        "en": "Ok.",
        "ar": "تمام.",
        "kind": "weak",
        "fix": "Okay, I understand. Thank you.",
        "hint": "تمام لوحدها ناشفة. اشكرها بجملة."
       }
      ]
     },
     {
      "bot": "By the way, we have a restaurant on the roof. Do you like fish?",
      "botAr": "بالمناسبة، عندنا مطعم على السطح. بتحب السمك؟",
      "opts": [
       {
        "en": "Yes, I am like fish very much.",
        "ar": "أيوه، بحب السمك جداً.",
        "kind": "wrong",
        "fix": "I like fish very much.",
        "hint": "like فعل من غير am."
       },
       {
        "en": "Yes, I like fish very much.",
        "ar": "أيوه، بحب السمك جداً.",
        "ok": true
       },
       {
        "en": "Fish, yes.",
        "ar": "السمك، أيوه.",
        "kind": "weak",
        "fix": "Yes, I like fish very much.",
        "hint": "مفهومة بس ناقصة. قول جملة كاملة."
       }
      ]
     },
     {
      "bot": "Great. Would you like a table for dinner tonight?",
      "botAr": "حلو. تحب ترابيزة للعشا الليلة؟",
      "opts": [
       {
        "en": "Yes, a table to two, please.",
        "ar": "ترابيزة لاتنين.",
        "kind": "wrong",
        "fix": "A table for two, please.",
        "hint": "عدد الأشخاص بنقول for two مش to two."
       },
       {
        "en": "Table.",
        "ar": "ترابيزة.",
        "kind": "weak",
        "fix": "Yes, a table for two, please.",
        "hint": "كلمة واحدة. اطلب بجملة مؤدبة."
       },
       {
        "en": "Yes, a table for two, please.",
        "ar": "أيوه، ترابيزة لاتنين لو سمحتي.",
        "ok": true
       }
      ]
     },
     {
      "bot": "What time would you like?",
      "botAr": "تحب الساعة كام؟",
      "opts": [
       {
        "en": "At eight o'clock, please.",
        "ar": "الساعة تمانية لو سمحتي.",
        "ok": true
       },
       {
        "en": "At the eight o'clock, please.",
        "ar": "الساعة تمانية.",
        "kind": "wrong",
        "fix": "At eight o'clock, please.",
        "hint": "مفيش the قبل الساعة."
       },
       {
        "en": "Eight.",
        "ar": "تمانية.",
        "kind": "weak",
        "fix": "At eight o'clock, please.",
        "hint": "رقم لوحده. قول At eight o'clock, please."
       }
      ]
     },
     {
      "bot": "Perfect, a table for two at eight. Is it a special day?",
      "botAr": "تمام، ترابيزة لاتنين الساعة تمانية. هو يوم مميز؟",
      "opts": [
       {
        "en": "Yes, it is my wife birthday.",
        "ar": "أيوه، عيد ميلاد مراتي.",
        "kind": "wrong",
        "fix": "It is my wife's birthday.",
        "hint": "الملكية بنعملها بـ 's: my wife's birthday."
       },
       {
        "en": "Yes, it is my wife's birthday.",
        "ar": "أيوه، النهاردة عيد ميلاد مراتي.",
        "ok": true
       },
       {
        "en": "Yes, birthday.",
        "ar": "أيوه، عيد ميلاد.",
        "kind": "weak",
        "fix": "Yes, it is my wife's birthday.",
        "hint": "مفهومة بس ناقصة. قول جملة كاملة."
       }
      ]
     },
     {
      "bot": "How nice! We can bring a small cake. Do you want that?",
      "botAr": "جميل! ممكن نجيب تورتة صغيرة. تحب كده؟",
      "opts": [
       {
        "en": "Yes, that will be wonderfully.",
        "ar": "أيوه، هيبقى رائع.",
        "kind": "wrong",
        "fix": "That would be wonderful.",
        "hint": "بعد be بنحط صفة: wonderful مش wonderfully."
       },
       {
        "en": "Yes, cake.",
        "ar": "أيوه، تورتة.",
        "kind": "weak",
        "fix": "Yes, that would be wonderful. Thank you!",
        "hint": "مفهومة بس ناقصة. اشكرها بجملة."
       },
       {
        "en": "Yes, that would be wonderful. Thank you!",
        "ar": "أيوه، هيبقى رائع. شكراً!",
        "ok": true
       }
      ]
     },
     {
      "bot": "We will do it. By the way, the pool closes at ten.",
      "botAr": "هنعمل كده. بالمناسبة، حمام السباحة بيقفل الساعة عشرة.",
      "opts": [
       {
        "en": "Thank you for the information.",
        "ar": "شكراً على المعلومة.",
        "ok": true
       },
       {
        "en": "Thank you for the informations.",
        "ar": "شكراً على المعلومات.",
        "kind": "wrong",
        "fix": "Thank you for the information.",
        "hint": "information مبتتجمعش بـ s."
       },
       {
        "en": "Ok.",
        "ar": "تمام.",
        "kind": "weak",
        "fix": "Thank you for the information.",
        "hint": "تمام لوحدها ناشفة. اشكرها بجملة."
       }
      ]
     }
    ]
   },
   {
    "title": "المغادرة",
    "steps": [
     {
      "bot": "Good morning, Mr. Hassan. Did you have a good dinner last night?",
      "botAr": "صباح الخير يا أستاذ حسن. العشا كان حلو إمبارح؟",
      "opts": [
       {
        "en": "Yes, the food was great and my wife love the cake.",
        "ar": "الأكل كان رائع ومراتي حبت التورتة.",
        "kind": "wrong",
        "fix": "my wife loved the cake",
        "hint": "ده حصل في الماضي: loved."
       },
       {
        "en": "Yes, the food was great and my wife loved the cake.",
        "ar": "أيوه، الأكل كان رائع ومراتي حبت التورتة.",
        "ok": true
       },
       {
        "en": "Yes, good.",
        "ar": "أيوه، حلو.",
        "kind": "weak",
        "fix": "Yes, the food was great and my wife loved the cake.",
        "hint": "مفهومة بس بسيطة. احكيلها أكتر بجملة."
       }
      ]
     },
     {
      "bot": "We are happy to hear that. When are you leaving?",
      "botAr": "مبسوطين إننا سمعنا كده. هتسافر امتى؟",
      "opts": [
       {
        "en": "I leave today at the noon.",
        "ar": "هسافر النهاردة الضهر.",
        "kind": "wrong",
        "fix": "I am leaving today at noon.",
        "hint": "noon من غير the. وللخطة بنقول I am leaving."
       },
       {
        "en": "Today.",
        "ar": "النهاردة.",
        "kind": "weak",
        "fix": "I am leaving today at noon.",
        "hint": "كلمة واحدة. قول جملة كاملة."
       },
       {
        "en": "I am leaving today at noon.",
        "ar": "هسافر النهاردة الضهر.",
        "ok": true
       }
      ]
     },
     {
      "bot": "Okay. Do you want a late check-out? It costs 100 riyals.",
      "botAr": "تمام. عايز تأخير في الخروج؟ بمية ريال.",
      "opts": [
       {
        "en": "No, thank you. I will check out at twelve.",
        "ar": "لا، شكراً. هخرج الساعة اتناشر.",
        "ok": true
       },
       {
        "en": "No, thank you. I will checking out at twelve.",
        "ar": "لا، شكراً. هخرج الساعة 12.",
        "kind": "wrong",
        "fix": "I will check out at twelve.",
        "hint": "بعد will الفعل بسيط من غير ing."
       },
       {
        "en": "No.",
        "ar": "لا.",
        "kind": "weak",
        "fix": "No, thank you. I will check out at twelve.",
        "hint": "لا لوحدها ناشفة. زود thank you."
       }
      ]
     },
     {
      "bot": "Do you need a taxi to the airport?",
      "botAr": "محتاج تاكسي للمطار؟",
      "opts": [
       {
        "en": "Yes, please. I need taxi at one o'clock.",
        "ar": "محتاج تاكسي الساعة واحدة.",
        "kind": "wrong",
        "fix": "I need a taxi at one o'clock.",
        "hint": "لازم a قبل taxi."
       },
       {
        "en": "Yes, please. I need a taxi at one o'clock.",
        "ar": "أيوه لو سمحتي. محتاج تاكسي الساعة واحدة.",
        "ok": true
       },
       {
        "en": "Taxi, one.",
        "ar": "تاكسي، واحدة.",
        "kind": "weak",
        "fix": "Yes, please. I need a taxi at one o'clock.",
        "hint": "مفهومة بس ناقصة. اطلب بجملة."
       }
      ]
     },
     {
      "bot": "No problem. Here is your bill. Please check it.",
      "botAr": "مفيش مشكلة. ده الحساب. راجعه لو سمحت.",
      "opts": [
       {
        "en": "Thank you. Can I paying by card?",
        "ar": "ممكن أدفع بالكارت؟",
        "kind": "wrong",
        "fix": "Can I pay by card?",
        "hint": "بعد can الفعل بسيط من غير ing."
       },
       {
        "en": "Card?",
        "ar": "كارت؟",
        "kind": "weak",
        "fix": "Thank you. Can I pay by card?",
        "hint": "كلمة واحدة. اسأل سؤال كامل."
       },
       {
        "en": "Thank you. Can I pay by card?",
        "ar": "شكراً. ممكن أدفع بالكارت؟",
        "ok": true
       }
      ]
     },
     {
      "bot": "Of course. Please enter your PIN. Your total is 1,200 riyals.",
      "botAr": "طبعاً. اكتب الرقم السري. الإجمالي 1200 ريال.",
      "opts": [
       {
        "en": "Okay. Is breakfast included?",
        "ar": "تمام. الفطار شامل؟",
        "ok": true
       },
       {
        "en": "Okay. Is included the breakfast?",
        "ar": "تمام. الفطار شامل؟",
        "kind": "wrong",
        "fix": "Is breakfast included?",
        "hint": "ترتيب السؤال: Is breakfast included."
       },
       {
        "en": "Breakfast?",
        "ar": "الفطار؟",
        "kind": "weak",
        "fix": "Is breakfast included?",
        "hint": "كلمة واحدة. اسأل سؤال كامل."
       }
      ]
     },
     {
      "bot": "Yes, breakfast is included. Here is your receipt.",
      "botAr": "أيوه، الفطار شامل. ده الإيصال.",
      "opts": [
       {
        "en": "Thank you. I can to leave my bags here?",
        "ar": "ممكن أسيب شنطي هنا؟",
        "kind": "wrong",
        "fix": "May I leave my bags here?",
        "hint": "بعد can أو may الفعل من غير to."
       },
       {
        "en": "Thank you. May I leave my bags here?",
        "ar": "شكراً. ممكن أسيب شنطي هنا؟",
        "ok": true
       },
       {
        "en": "Bags here.",
        "ar": "شنط هنا.",
        "kind": "weak",
        "fix": "Thank you. May I leave my bags here?",
        "hint": "مفهومة بس مش مؤدبة. اسأل بجملة."
       }
      ]
     },
     {
      "bot": "Yes. We can keep them until one o'clock.",
      "botAr": "أيوه. ممكن نحتفظ بيهم لحد الساعة واحدة.",
      "opts": [
       {
        "en": "That is great. Thank you for all thing.",
        "ar": "شكراً على كل حاجة.",
        "kind": "wrong",
        "fix": "Thank you for everything.",
        "hint": "كل حاجة بالإنجليزي everything."
       },
       {
        "en": "Great.",
        "ar": "رائع.",
        "kind": "weak",
        "fix": "That is great. Thank you for everything.",
        "hint": "كلمة واحدة. اشكرها بجملة."
       },
       {
        "en": "That is great. Thank you for everything.",
        "ar": "ده رائع. شكراً على كل حاجة.",
        "ok": true
       }
      ]
     },
     {
      "bot": "It was a pleasure. Would you like to give us feedback?",
      "botAr": "كان من دواعي سروري. تحب تدينا رأيك؟",
      "opts": [
       {
        "en": "Yes, I loved the hotel. The staff were very kind.",
        "ar": "أيوه، حبيت الفندق. الموظفين كانوا لطاف جداً.",
        "ok": true
       },
       {
        "en": "Yes, I loved the hotel. The staffs were very kind.",
        "ar": "الموظفين كانوا لطاف.",
        "kind": "wrong",
        "fix": "The staff were very kind.",
        "hint": "staff مبتتجمعش بـ s."
       },
       {
        "en": "Yes, nice.",
        "ar": "أيوه، حلو.",
        "kind": "weak",
        "fix": "Yes, I loved the hotel. The staff were very kind.",
        "hint": "مفهومة بس بسيطة. قول رأيك بجملة."
       }
      ]
     },
     {
      "bot": "Thank you so much! We hope to see you again. Have a safe trip!",
      "botAr": "شكراً جزيلاً! نتمنى نشوفك تاني. رحلة آمنة!",
      "opts": [
       {
        "en": "Thank you. I will came back next year!",
        "ar": "هرجع السنة الجاية!",
        "kind": "wrong",
        "fix": "I will come back next year.",
        "hint": "بعد will الفعل زي ما هو: come."
       },
       {
        "en": "Thank you. I will come back next year!",
        "ar": "شكراً. هرجع السنة الجاية!",
        "ok": true
       },
       {
        "en": "Bye.",
        "ar": "سلام.",
        "kind": "weak",
        "fix": "Thank you. I will come back next year!",
        "hint": "سلام لوحدها ناشفة. اشكرها وقول جملة."
       }
      ]
     }
    ]
   }
  ],
  "end": {
   "bot": "Goodbye, Mr. Hassan. See you soon at the Palm Hotel!",
   "botAr": "مع السلامة يا أستاذ حسن. نشوفك قريب في فندق بالم!"
  }
 }
];
