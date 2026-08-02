const Dua = require('../models/Dua');

const defaultDuas = [
  // General
  {
    title: 'Dua for Forgiveness (Sayyid al-Istighfar)',
    arabicText: 'اللَّهُمَّ أَنْتَ رَبِّي لا إِلَهَ إِلا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ، وَأَبُوءُ لَكَ بِذَنْبِي فَاغْفِرْ لِي، فَإِنَّهُ لا يَغْفِرُ الذُّنُوبَ إِلا أَنْتَ',
    transliteration: 'Allahumma anta Rabbi la ilaha illa anta, Khalaqtani wa ana abduka, wa ana \'ala ahdika wa wa\'dika mastata\'tu, A\'udhu bika min sharri ma sana\'tu, abu\'u laka bini\'matika \'alayya, wa abu\'u laka bidhanbi faghfir li, fa innahu la yaghfirud-dhunuba illa anta.',
    translation: 'O Allah! You are my Lord! None has the right to be worshipped but You. You created me and I am Your slave, and I am faithful to my covenant and my promise as much as I can. I seek refuge with You from all the evil I have done. I acknowledge before You all the blessings You have bestowed upon me, and I confess to You all my sins. So I entreat You to forgive my sins, for nobody can forgive sins except You.',
    category: 'General',
    tags: ['forgiveness', 'daily'],
    source: 'Sahih al-Bukhari',
    isCustom: false
  },
  {
    title: 'Dua for Good in this World and the Hereafter',
    arabicText: 'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ',
    transliteration: 'Rabbana atina fid-dunya hasanatan wa fil \'akhirati hasanatan waqina \'adhaban-nar.',
    translation: 'Our Lord, give us in this world [that which is] good and in the Hereafter [that which is] good and protect us from the punishment of the Fire.',
    category: 'General',
    tags: ['quran', 'comprehensive'],
    source: 'Quran 2:201',
    isCustom: false
  },
  
  // Morning
  {
    title: 'Dua Upon Waking Up',
    arabicText: 'الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ',
    transliteration: 'Alhamdu lillahil-ladhi ahyana ba\'da ma amatana wa ilaihin-nushur.',
    translation: 'All praise is for Allah who gave us life after having taken it from us and unto Him is the resurrection.',
    category: 'Morning',
    tags: ['waking', 'morning'],
    source: 'Sahih al-Bukhari',
    isCustom: false
  },
  
  // Evening
  {
    title: 'Evening Remembrance',
    arabicText: 'أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ لا إِلَهَ إِلا اللَّهُ، وَحْدَهُ لا شَرِيكَ لَهُ',
    transliteration: 'Amsayna wa amsal-mulku lillah, walhamdu lillah, la ilaha illallah, wahdahu la sharika lah.',
    translation: 'We have reached the evening and at this very time unto Allah belongs all sovereignty, and all praise is for Allah. None has the right to be worshipped except Allah, alone, without partner.',
    category: 'Evening',
    tags: ['evening', 'dhikr'],
    source: 'Sahih Muslim',
    isCustom: false
  },

  // After Prayer
  {
    title: 'Dua After Salah',
    arabicText: 'اللَّهُمَّ أَنْتَ السَّلامُ وَمِنْكَ السَّلامُ، تَبَارَكْتَ يَا ذَا الْجَلالِ وَالإِكْرَامِ',
    transliteration: 'Allahumma antas-salam wa minkas-salam, tabarakta ya dhal-jalali wal-ikram.',
    translation: 'O Allah, You are Peace and from You comes peace. Blessed are You, O Owner of majesty and honor.',
    category: 'After Prayer',
    tags: ['salah', 'peace'],
    source: 'Sahih Muslim',
    isCustom: false
  },

  // Travel
  {
    title: 'Dua for Travel',
    arabicText: 'سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ، وَإِنَّا إِلَى رَبِّنَا لَمُنْقَلِبُونَ',
    transliteration: 'Subhanal-ladhi sakh-khara lana hadha wa ma kunna lahu muqrinin. Wa inna ila Rabbina lamunqalibun.',
    translation: 'Glory unto Him Who created this transportation, for us, though we were unable to create it on our own. And unto our Lord we shall return.',
    category: 'Travel',
    tags: ['travel', 'vehicle'],
    source: 'Quran 43:13-14',
    isCustom: false
  },

  // Hardship
  {
    title: 'Dua for Relief from Distress (Dua of Yunus)',
    arabicText: 'لَّا إِلَٰهَ إِلَّا أَنتَ سُبْحَانَكَ إِنِّي كُنتُ مِنَ الظَّالِمِينَ',
    transliteration: 'La ilaha illa anta subhanaka inni kuntu minaz-zalimin.',
    translation: 'There is no deity except You; exalted are You. Indeed, I have been of the wrongdoers.',
    category: 'Hardship',
    tags: ['distress', 'prophets', 'quran'],
    source: 'Quran 21:87',
    isCustom: false
  }
];

const seedDefaultDuas = async () => {
  try {
    // Check if there are any global duas already (userId: null)
    const existingCount = await Dua.countDocuments({ userId: null });
    
    if (existingCount === 0) {
      console.log('No default Duas found. Seeding default Duas...');
      // Ensure all seed data explicitly has userId as null
      const seedData = defaultDuas.map(dua => ({ ...dua, userId: null }));
      await Dua.insertMany(seedData);
      console.log(`Successfully seeded ${seedData.length} default Duas.`);
    } else {
      console.log('Default Duas already exist. Skipping seed.');
    }
  } catch (error) {
    console.error('Error seeding default Duas:', error);
  }
};

module.exports = seedDefaultDuas;
