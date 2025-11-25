import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Message from '#models/message'
import { DateTime } from 'luxon'

export default class MessageSeeder extends BaseSeeder {
  async run() {
    await Message.createMany([
      // ========================
      // 1. Slováci na Mladosti
      // channel_id = 1
      // ========================

      {
        userId: 7, // Filip Burin
        channelId: 1,
        mentions: [],
        text: 'Tešíte sa na nový semester?',
        createdAt: DateTime.fromISO('2025-10-01T10:00:00'),
      },
      {
        userId: 9,
        channelId: 1,
        mentions: [],
        text: './vote kick burin 1/5',
        createdAt: DateTime.fromISO('2025-10-01T10:01:00'),
      },
      {
        userId: 13, // Juraj
        channelId: 1,
        mentions: [2],
        text: '@firefly96 daj mu ban',
        createdAt: DateTime.fromISO('2025-10-01T10:02:00'),
      },
      {
        userId: 12,
        channelId: 1,
        mentions: [],
        text: 'F1',
        createdAt: DateTime.fromISO('2025-10-01T10:03:00'),
      },
      {
        userId: 13,
        channelId: 1,
        mentions: [],
        text: 'F1',
        createdAt: DateTime.fromISO('2025-10-01T10:04:00'),
      },
      {
        userId: 13,
        channelId: 1,
        mentions: [2],
        text: '@firefly daj mu ban už fakt',
        createdAt: DateTime.fromISO('2025-10-01T10:05:00'),
      },
      {
        userId: 2, // Svetlana
        channelId: 1,
        mentions: [],
        text: 'Niekto Mekáč dnes večer?',
        createdAt: DateTime.fromISO('2025-10-01T10:06:00'),
      },
      {
        userId: 9, // Dávid
        channelId: 1,
        mentions: [],
        text: 'Ja mám na účte 3 eurá, takže pass',
        createdAt: DateTime.fromISO('2025-10-01T10:07:00'),
      },
      {
        userId: 2,
        channelId: 1,
        mentions: [],
        text: 'GG',
        createdAt: DateTime.fromISO('2025-10-01T10:08:00'),
      },
      {
        userId: 13,
        channelId: 1,
        mentions: [2],
        text: 'Nie každý je bohatý jak ty',
        createdAt: DateTime.fromISO('2025-10-01T10:09:00'),
      },
      {
        userId: 11, // Richard
        channelId: 1,
        mentions: [2],
        text: 'Ja si dám kľudne tiež',
        createdAt: DateTime.fromISO('2025-10-01T10:10:00'),
      },
      {
        userId: 11,
        channelId: 1,
        mentions: [2, 13],
        text: '@firefly96 @diktator SK4011000000002621000624',
        createdAt: DateTime.fromISO('2025-10-01T10:11:00'),
      },

      // ========================
      // 2. Študenti FIIT 3. ročník
      // channel_id = 2
      // ========================

      {
        userId: 7,
        channelId: 2,
        mentions: [],
        text: 'Zajtra o 9:00 je zápis na predmety, nezabudnite',
        createdAt: DateTime.fromISO('2025-10-01T11:00:00'),
      },
      {
        userId: 1, // Nikol
        channelId: 2,
        mentions: [],
        text: 'Neviete dokedy je ICP deadline? Či v nedeľu alebo pondelok?',
        createdAt: DateTime.fromISO('2025-10-01T11:01:00'),
      },
      {
        userId: 18, // Jakub
        channelId: 2,
        mentions: [],
        text: 'V AISe je napísané pondelok 23:59',
        createdAt: DateTime.fromISO('2025-10-01T11:02:00'),
      },
      {
        userId: 2,
        channelId: 2,
        mentions: [],
        text: 'Super, tak to možno stíhame',
        createdAt: DateTime.fromISO('2025-10-01T11:03:00'),
      },
      {
        userId: 7, // Filip
        channelId: 2,
        mentions: [],
        text: 'Ak chcete, mám poznámky z prednášky, hodil som ich do spoločného priečinka',
        createdAt: DateTime.fromISO('2025-10-01T11:04:00'),
      },
      {
        userId: 23, // Herby
        channelId: 2,
        mentions: [],
        text: 'Ďakujeme',
        createdAt: DateTime.fromISO('2025-10-01T11:05:00'),
      },
      {
        userId: 21, // Martin
        channelId: 2,
        mentions: [],
        text: 'Dajte potom niekto šablónu prosím k tej bakalárke',
        createdAt: DateTime.fromISO('2025-10-01T11:06:00'),
      },

      // ========================
      // 3. FIIT (public)
      // channel_id = 3
      // ========================

      {
        userId: 1,
        channelId: 3,
        mentions: [],
        text: 'Prosím nápad na tému bakalárky pre niekoho, kto nemá nervy na embedded 😭',
        createdAt: DateTime.fromISO('2025-10-01T12:00:00'),
      },
      {
        userId: 14, // Matej S
        channelId: 3,
        mentions: [],
        text: 'Daj si niečo s UX alebo webkami',
        createdAt: DateTime.fromISO('2025-10-01T12:01:00'),
      },
      {
        userId: 2,
        channelId: 3,
        mentions: [],
        text: 'UX ti zoberiem ja',
        createdAt: DateTime.fromISO('2025-10-01T12:02:00'),
      },
      {
        userId: 20,
        channelId: 3,
        mentions: [],
        text: 'Niekto vie, či sa dnes z OS-ky píše kvíz alebo len kontroluje úlohy?',
        createdAt: DateTime.fromISO('2025-10-01T12:03:00'),
      },
      {
        userId: 18,
        channelId: 3,
        mentions: [],
        text: 'Písali v skupine, že len skontroluje úlohy. Chill',
        createdAt: DateTime.fromISO('2025-10-01T12:04:00'),
      },
      {
        userId: 10,
        channelId: 3,
        mentions: [],
        text: 'Random otázka: kto dáva dnes po cvičkách Flexi?',
        createdAt: DateTime.fromISO('2025-10-01T12:05:00'),
      },
      {
        userId: 9,
        channelId: 3,
        mentions: [],
        text: 'Ja ak prežijem štatistiku',
        createdAt: DateTime.fromISO('2025-10-01T12:06:00'),
      },
      {
        userId: 11,
        channelId: 3,
        mentions: [],
        text: 'Ja musím dorobiť jednu labku, ale večer by som dal',
        createdAt: DateTime.fromISO('2025-10-01T12:07:00'),
      },
      {
        userId: 15,
        channelId: 3,
        mentions: [],
        text: 'Pravidlá sú v pripnutých správach. Nečitateľom hrozí mute',
        createdAt: DateTime.fromISO('2025-10-01T12:08:00'),
      },

      // ========================
      // 5. League of Legends (public)
      // channel_id = 5
      // ========================

      {
        userId: 16, // Faker
        channelId: 5,
        mentions: [],
        text: 'Welcome to League of Legends channel! Keep it chill and GL HF',
        createdAt: DateTime.fromISO('2025-10-01T14:00:00'),
      },
      {
        userId: 17,
        channelId: 5,
        mentions: [],
        text: 'We need Diamond bot support on Flex 5 stack. Only tryhards',
        createdAt: DateTime.fromISO('2025-10-01T14:01:00'),
      },
      {
        userId: 10,
        channelId: 5,
        mentions: [],
        text: 'I can supp – mrkva717#EUNE',
        createdAt: DateTime.fromISO('2025-10-01T14:02:00'),
      },
      {
        userId: 9,
        channelId: 5,
        mentions: [],
        text: 'Ja môžem jungle ak treba',
        createdAt: DateTime.fromISO('2025-10-01T14:03:00'),
      },
      {
        userId: 11,
        channelId: 5,
        mentions: [],
        text: 'Dám ARAM kedykoľvek',
        createdAt: DateTime.fromISO('2025-10-01T14:04:00'),
      },
      {
        userId: 2,
        channelId: 5,
        mentions: [],
        text: 'Luki, kedy ideme duo? Ty si stále AFK',
        createdAt: DateTime.fromISO('2025-10-01T14:05:00'),
      },
      {
        userId: 6,
        channelId: 5,
        mentions: [],
        text: 'Som v škole, ešte večer môžeme',
        createdAt: DateTime.fromISO('2025-10-01T14:06:00'),
      },
      {
        userId: 17,
        channelId: 5,
        mentions: [],
        text: 'Luki, ty si bot aj bez ranku. Tvoja mamka by to zahrala lepšie',
        createdAt: DateTime.fromISO('2025-10-01T14:07:00'),
      },
      {
        userId: 9,
        channelId: 5,
        mentions: [],
        text: 'Prestaňte roastiť Lukiho. Ideme queue alebo nie?',
        createdAt: DateTime.fromISO('2025-10-01T14:08:00'),
      },
      {
        userId: 11,
        channelId: 5,
        mentions: [],
        text: 'Idete niekto ARAM teraz? Som zase solo',
        createdAt: DateTime.fromISO('2025-10-01T14:09:00'),
      },
      {
        userId: 2,
        channelId: 5,
        mentions: [11, 8],
        text: '@tetris @kivin ideme ARAM o 5 min',
        createdAt: DateTime.fromISO('2025-10-01T14:10:00'),
      },
      {
        userId: 8,
        channelId: 5,
        mentions: [],
        text: 'Môžem, ale len dve hry',
        createdAt: DateTime.fromISO('2025-10-01T14:11:00'),
      },

      // ========================
      // 6. Marvel Rivals (public)
      // channel_id = 6
      // ========================

      {
        userId: 1,
        channelId: 6,
        mentions: [],
        text: 'Kto ide dnes Rivals? Potrebujem vypnúť mozog',
        createdAt: DateTime.fromISO('2025-10-01T15:00:00'),
      },
      {
        userId: 3,
        channelId: 6,
        mentions: [],
        text: 'Môžem o chvíľu, len dojdem domov',
        createdAt: DateTime.fromISO('2025-10-01T15:01:00'),
      },
      {
        userId: 7,
        channelId: 6,
        mentions: [],
        text: 'Ja som už v lobby a totálne tu tryhardia Angličania',
        createdAt: DateTime.fromISO('2025-10-01T15:02:00'),
      },
      {
        userId: 1,
        channelId: 6,
        mentions: [],
        text: 'Daj invite, keď budeš v hre',
        createdAt: DateTime.fromISO('2025-10-01T15:03:00'),
      },
      {
        userId: 3,
        channelId: 6,
        mentions: [],
        text: 'Nick je svatec#EU keby niečo',
        createdAt: DateTime.fromISO('2025-10-01T15:04:00'),
      },
      {
        userId: 7,
        channelId: 6,
        mentions: [],
        text: 'Random team zas behá solo, ja to nechápem',
        createdAt: DateTime.fromISO('2025-10-01T15:05:00'),
      },
      {
        userId: 1,
        channelId: 6,
        mentions: [],
        text: 'Vitaj v soloQ Rivals',
        createdAt: DateTime.fromISO('2025-10-01T15:06:00'),
      },

      // ========================
      // 7. Spotify – random ľudia
      // channel_id = 7
      // ========================

      {
        userId: 18,
        channelId: 7,
        mentions: [],
        text: 'Čo teraz počúvate pri učení?',
        createdAt: DateTime.fromISO('2025-10-01T16:00:00'),
      },
      {
        userId: 5,
        channelId: 7,
        mentions: [],
        text: 'Aphex Twin all dayyyy',
        createdAt: DateTime.fromISO('2025-10-01T16:01:00'),
      },
      {
        userId: 19,
        channelId: 7,
        mentions: [],
        text: 'Ja nejaký random heavy metal, inak zaspím',
        createdAt: DateTime.fromISO('2025-10-01T16:02:00'),
      },
      {
        userId: 18,
        channelId: 7,
        mentions: [],
        text: 'Niekto videl K-pop Demon Hunters? Ten film je totál top',
        createdAt: DateTime.fromISO('2025-10-01T16:03:00'),
      },
      {
        userId: 5,
        channelId: 7,
        mentions: [],
        text: 'To je ten, čo si spomínal minule?',
        createdAt: DateTime.fromISO('2025-10-01T16:04:00'),
      },
      {
        userId: 18,
        channelId: 7,
        mentions: [5],
        text: '@betka toto ti totálne sadne k tomu Aphex Twinu',
        createdAt: DateTime.fromISO('2025-10-01T16:05:00'),
      },
      {
        userId: 19,
        channelId: 7,
        mentions: [],
        text: 'To znie ako niečo, čo ma bude iritovať, ale pustím si to',
        createdAt: DateTime.fromISO('2025-10-01T16:06:00'),
      },
      {
        userId: 5,
        channelId: 7,
        mentions: [],
        text: 'Pošli playlist, pls',
        createdAt: DateTime.fromISO('2025-10-01T16:07:00'),
      },

      // ========================
      // 8. ICP – BudgetBuddy
      // channel_id = 8
      // ========================
      // (všetko ponechané obsahovo, len upravené diakritika a štýl)

      {
        userId: 20,
        channelId: 8,
        mentions: [],
        text: 'Nefungujú mi Teams. Viete mi prosím poslať, čo máme spraviť do ďalšieho cvičenia?',
        createdAt: DateTime.fromISO('2025-10-01T17:00:00'),
      },
      {
        userId: 1,
        channelId: 8,
        mentions: [],
        text: 'https://www.youtube.com/watch?v=9LN4ZNh1Tbc',
        createdAt: DateTime.fromISO('2025-10-01T17:01:00'),
      },
      {
        userId: 20,
        channelId: 8,
        mentions: [],
        text: 'Ďakujem',
        createdAt: DateTime.fromISO('2025-10-01T17:02:00'),
      },
      {
        userId: 1,
        channelId: 8,
        mentions: [],
        text: 'To je presne ten tutoriál, čo ukazoval na cvičení',
        createdAt: DateTime.fromISO('2025-10-01T17:03:00'),
      },
      {
        userId: 1,
        channelId: 8,
        mentions: [],
        text: 'Pozerám staré screenshoty z Figmy a mám chuť zmeniť celý návrh 😭',
        createdAt: DateTime.fromISO('2025-10-01T17:04:00'),
      },
      {
        userId: 2,
        channelId: 8,
        mentions: [],
        text: 'Umrem',
        createdAt: DateTime.fromISO('2025-10-01T17:05:00'),
      },
      {
        userId: 1,
        channelId: 8,
        mentions: [],
        text: 'Všetko som prekopírovala do nového Hi-Fi súboru, niektoré texty sa tam rozbili, musíme ich dorobiť ručne',
        createdAt: DateTime.fromISO('2025-10-01T17:06:00'),
      },
      {
        userId: 1,
        channelId: 8,
        mentions: [],
        text: 'Dala som tam aj celý Material Design kit do Assets',
        createdAt: DateTime.fromISO('2025-10-01T17:07:00'),
      },
      {
        userId: 2,
        channelId: 8,
        mentions: [],
        text: 'Môžem skúsiť spraviť homepage responzívne a skopírujeme to ďalej. Bez autolayoutu je to bolesť',
        createdAt: DateTime.fromISO('2025-10-01T17:08:00'),
      },
      {
        userId: 1,
        channelId: 8,
        mentions: [],
        text: 'Môžeš, ale neviem či „Paste to replace“ bude fungovať ideálne',
        createdAt: DateTime.fromISO('2025-10-01T17:09:00'),
      },
      {
        userId: 2,
        channelId: 8,
        mentions: [],
        text: 'Treba robiť aj popup na pridanie bankového spojenia',
        createdAt: DateTime.fromISO('2025-10-01T17:10:00'),
      },
      {
        userId: 1,
        channelId: 8,
        mentions: [],
        text: 'Ťažko povedať, ale asi hej',
        createdAt: DateTime.fromISO('2025-10-01T17:11:00'),
      },
      {
        userId: 2,
        channelId: 8,
        mentions: [],
        text: 'Spravila som dve verzie, neviem ktorá je lepšia 😭',
        createdAt: DateTime.fromISO('2025-10-01T17:12:00'),
      },
      {
        userId: 1,
        channelId: 8,
        mentions: [],
        text: 'Za mňa jednoduchšia',
        createdAt: DateTime.fromISO('2025-10-01T17:13:00'),
      },
      {
        userId: 2,
        channelId: 8,
        mentions: [],
        text: 'OK, zistíme aj čo chce cvičiaca',
        createdAt: DateTime.fromISO('2025-10-01T17:14:00'),
      },
      {
        userId: 2,
        channelId: 8,
        mentions: [],
        text: 'Pridala som všetky popupy, môžeme prerábať',
        createdAt: DateTime.fromISO('2025-10-01T17:15:00'),
      },
      {
        userId: 1,
        channelId: 8,
        mentions: [],
        text: 'Dík moc, toto bude ešte náročné',
        createdAt: DateTime.fromISO('2025-10-01T17:16:00'),
      },
      {
        userId: 2,
        channelId: 8,
        mentions: [],
        text: 'Rozmýšľam, že profil v rohu by mal otvoriť len malé menu s logoutom a nastaveniami',
        createdAt: DateTime.fromISO('2025-10-01T17:17:00'),
      },
      {
        userId: 1,
        channelId: 8,
        mentions: [],
        text: 'Kľudne stačí, keď tam bude len logout',
        createdAt: DateTime.fromISO('2025-10-01T17:18:00'),
      },
      {
        userId: 2,
        channelId: 8,
        mentions: [],
        text: 'OK, dám do Settings neskôr aj fotku a pod',
        createdAt: DateTime.fromISO('2025-10-01T17:19:00'),
      },
      {
        userId: 2,
        channelId: 8,
        mentions: [],
        text: 'Môže byť toto riešenie?',
        createdAt: DateTime.fromISO('2025-10-01T17:20:00'),
      },
      {
        userId: 18,
        channelId: 8,
        mentions: [],
        text: 'Toto sú tie okná, čo ešte treba spraviť',
        createdAt: DateTime.fromISO('2025-10-01T17:21:00'),
      },
      {
        userId: 2,
        channelId: 8,
        mentions: [],
        text: 'Hej, presne tie',
        createdAt: DateTime.fromISO('2025-10-01T17:22:00'),
      },
      {
        userId: 1,
        channelId: 8,
        mentions: [],
        text: 'Áno, tie',
        createdAt: DateTime.fromISO('2025-10-01T17:23:00'),
      },
      {
        userId: 18,
        channelId: 8,
        mentions: [],
        text: 'Dobre, dokončím prezentáciu a potom na to idem',
        createdAt: DateTime.fromISO('2025-10-01T17:24:00'),
      },
      {
        userId: 2,
        channelId: 8,
        mentions: [],
        text: 'Veľa vecí nechávame pôvodne, meníme hlavne kalendár, ikony, slidre a prvky z knižnice',
        createdAt: DateTime.fromISO('2025-10-01T17:25:00'),
      },
      {
        userId: 1,
        channelId: 8,
        mentions: [],
        text: 'Aj ikony meníme',
        createdAt: DateTime.fromISO('2025-10-01T17:26:00'),
      },
      {
        userId: 18,
        channelId: 8,
        mentions: [],
        text: 'OK, rozumiem',
        createdAt: DateTime.fromISO('2025-10-01T17:27:00'),
      },
      {
        userId: 1,
        channelId: 8,
        mentions: [],
        text: 'Veľa assetov už máme vlastných, stačí ich kopírovať',
        createdAt: DateTime.fromISO('2025-10-01T17:28:00'),
      },
      {
        userId: 2,
        channelId: 8,
        mentions: [18],
        text: '@jakub_velky vedel by si vo Figme spraviť, aby sa skupina pripla medzi „Pinned“, keď ju pripneme?',
        createdAt: DateTime.fromISO('2025-10-01T17:29:00'),
      },
      {
        userId: 1,
        channelId: 8,
        mentions: [],
        text: 'Chceme, aby sa komponent pridal medzi pripnuté skupiny, keď ho pripneme',
        createdAt: DateTime.fromISO('2025-10-01T17:30:00'),
      },
      {
        userId: 18,
        channelId: 8,
        mentions: [],
        text: 'Hotovo',
        createdAt: DateTime.fromISO('2025-10-01T17:31:00'),
      },
      {
        userId: 2,
        channelId: 8,
        mentions: [],
        text: 'Super, ďakujeme',
        createdAt: DateTime.fromISO('2025-10-01T17:32:00'),
      },
      {
        userId: 1,
        channelId: 8,
        mentions: [],
        text: 'Ďakujeme, mal by si sa volať FigmaGod',
        createdAt: DateTime.fromISO('2025-10-01T17:33:00'),
      },
      {
        userId: 1,
        channelId: 8,
        mentions: [],
        text: 'Niekto z inej skupiny nás pochválil, že to máme pekné',
        createdAt: DateTime.fromISO('2025-10-01T17:34:00'),
      },
      {
        userId: 2,
        channelId: 8,
        mentions: [],
        text: 'Určite Burin',
        createdAt: DateTime.fromISO('2025-10-01T17:35:00'),
      },
      {
        userId: 18,
        channelId: 8,
        mentions: [],
        text: 'Robím prezentáciu do AISu, ide dokumentácia low-fi a screenshoty high-fi',
        createdAt: DateTime.fromISO('2025-10-01T17:36:00'),
      },
      {
        userId: 2,
        channelId: 8,
        mentions: [],
        text: 'V utorok nemôžem prezentovať Hi-Fi. Písala som jej, trochu sa bojím prezentovať sama ďalší týždeň',
        createdAt: DateTime.fromISO('2025-10-01T17:37:00'),
      },
      {
        userId: 1,
        channelId: 8,
        mentions: [],
        text: 'Zvládneš to',
        createdAt: DateTime.fromISO('2025-10-01T17:38:00'),
      },
      {
        userId: 1,
        channelId: 8,
        mentions: [],
        text: 'Spacingy a paddingy sú už vo variables',
        createdAt: DateTime.fromISO('2025-10-01T17:39:00'),
      },
      {
        userId: 18,
        channelId: 8,
        mentions: [],
        text: 'Doposielam prezentáciu',
        createdAt: DateTime.fromISO('2025-10-01T17:40:00'),
      },
      {
        userId: 20,
        channelId: 8,
        mentions: [],
        text: 'Aj ja som prezentoval sám, dá sa to',
        createdAt: DateTime.fromISO('2025-10-01T17:41:00'),
      },
      {
        userId: 2,
        channelId: 8,
        mentions: [],
        text: 'Ide o to, že low-fi aj high-fi idú po sebe a všetko je na mne. Môže to byť cringe',
        createdAt: DateTime.fromISO('2025-10-01T17:42:00'),
      },
      {
        userId: 20,
        channelId: 8,
        mentions: [],
        text: 'Jakub povie, že Hi-Fi je top a nech sa tešia, a máš pokoj',
        createdAt: DateTime.fromISO('2025-10-01T17:43:00'),
      },
      {
        userId: 18,
        channelId: 8,
        mentions: [],
        text: 'Keď nemôžem nahrávať testovanie, stačí to len prepisovať?',
        createdAt: DateTime.fromISO('2025-10-01T17:44:00'),
      },
      {
        userId: 1,
        channelId: 8,
        mentions: [],
        text: 'Asi áno, aj tak nebudeme ukazovať všetky videá',
        createdAt: DateTime.fromISO('2025-10-01T17:45:00'),
      },
      {
        userId: 1,
        channelId: 8,
        mentions: [],
        text: 'Pred testovaním treba doplniť zadania a otázky v dokumente. Chýba ešte use-case 5',
        createdAt: DateTime.fromISO('2025-10-01T17:46:00'),
      },
      {
        userId: 1,
        channelId: 8,
        mentions: [],
        text: 'Zajtra to prejdem celé',
        createdAt: DateTime.fromISO('2025-10-01T17:47:00'),
      },
      {
        userId: 2,
        channelId: 8,
        mentions: [],
        text: 'Stačí popísať, ako človek intuitívne postupoval',
        createdAt: DateTime.fromISO('2025-10-01T17:48:00'),
      },
      {
        userId: 1,
        channelId: 8,
        mentions: [],
        text: 'Najdôležitejšie sú odpovede, čas a problémy, čo vznikli',
        createdAt: DateTime.fromISO('2025-10-01T17:49:00'),
      },
      {
        userId: 1,
        channelId: 8,
        mentions: [],
        text: 'V dokumente musí byť všetko vypísané, videá sú len na prezentáciu',
        createdAt: DateTime.fromISO('2025-10-01T17:50:00'),
      },

      // ========================
      // 9. Bakalárka Generatory
      // channel_id = 9
      // ========================
      // (presne nechávam obsah ako si žiadal)
      {
        userId: 2,
        channelId: 9,
        mentions: [],
        text: 'Dobrý deň 😊',
        createdAt: DateTime.fromISO('2025-09-25T20:02:00'),
      },
      {
        userId: 2,
        channelId: 9,
        mentions: [],
        text: 'Dali by ste mi prosím kontakt na toho chalana, čo má inštalačku na MATIO?',
        createdAt: DateTime.fromISO('2025-09-25T20:02:10'),
      },
      {
        userId: 2,
        channelId: 9,
        mentions: [],
        text: 'Rada by som bakalárku začala niečo robiť ale stále nemám program v ktorom to mám robiť.',
        createdAt: DateTime.fromISO('2025-09-25T20:02:30'),
      },
      {
        userId: 22,
        channelId: 9,
        mentions: [],
        text: 'roman osadsky, mail by som musela pozriet v aise',
        createdAt: DateTime.fromISO('2025-09-26T09:15:00'),
      },
      {
        userId: 2,
        channelId: 9,
        mentions: [],
        text: 'Ďakujem, napíšem mu.',
        createdAt: DateTime.fromISO('2025-09-26T09:20:00'),
      },
      {
        userId: 24,
        channelId: 9,
        mentions: [],
        text: 'Dobré ráni, mohli by sme sa dnes alebo zajtra stretnúť?',
        createdAt: DateTime.fromISO('2025-10-01T08:05:00'),
      },
      {
        userId: 2,
        channelId: 9,
        mentions: [],
        text: 'Zdravím, rada by som si už dohodla prvú konzultáciu k bakalárke',
        createdAt: DateTime.fromISO('2025-10-01T08:12:00'),
      },
      {
        userId: 2,
        channelId: 9,
        mentions: [],
        text: 'potrebujem si ujasniť postup a ciele, aby som mohla reálne začať.. zatiaľ v tom nemám úplne jasno, keďže sme sa pred prázdninami len stručne rozprávali o téme',
        createdAt: DateTime.fromISO('2025-10-01T08:13:00'),
      },
      {
        userId: 2,
        channelId: 9,
        mentions: [],
        text: 'vyhovovalo by vám napríklad v utorok',
        createdAt: DateTime.fromISO('2025-10-01T08:20:00'),
      },
      {
        userId: 22,
        channelId: 9,
        mentions: [],
        text: 'v pondelok mozem o 15.00, v utorok len o 20.00 ked skoncim prednasku, cele dni ucim',
        createdAt: DateTime.fromISO('2025-10-02T21:30:00'),
      },
      {
        userId: 2,
        channelId: 9,
        mentions: [],
        text: 'Utorok by som teoreticky mohla, prípadne aj v stredu keby sa vám dá',
        createdAt: DateTime.fromISO('2025-10-02T21:45:00'),
      },
      {
        userId: 22,
        channelId: 9,
        mentions: [],
        text: 'ok radsej ten utorok',
        createdAt: DateTime.fromISO('2025-10-04T10:00:00'),
      },
      {
        userId: 23,
        channelId: 9,
        mentions: [],
        text: 'Dobré ráno, na kedy si to dohodneme?',
        createdAt: DateTime.fromISO('2025-10-10T08:00:00'),
      },
      {
        userId: 22,
        channelId: 9,
        mentions: [],
        text: 'idem na prednasku a ked skoncim napusem, ze ako sa budem citit a podla toho dohodneme',
        createdAt: DateTime.fromISO('2025-10-10T13:30:00'),
      },
      {
        userId: 23,
        channelId: 9,
        mentions: [],
        text: 'Dobre, ďakujem',
        createdAt: DateTime.fromISO('2025-10-10T13:35:00'),
      },
      {
        userId: 23,
        channelId: 9,
        mentions: [],
        text: 'Dobrý večer, chcel by som sa opýtať, či zvládate ten večerný Webex. Išiel som na prednášku, ale tých 20:15 viem byť on-line',
        createdAt: DateTime.fromISO('2025-10-15T20:10:00'),
      },
      {
        userId: 23,
        channelId: 9,
        mentions: [],
        text: 'Ak sa to dnes nepodarí, tak v poriadku, ale chcel by som konzultovať v čo najbližšej možnej dobe 🙏',
        createdAt: DateTime.fromISO('2025-10-15T20:20:00'),
      },
      {
        userId: 23,
        channelId: 9,
        mentions: [],
        text: 'Dobrý deň, pani Kováčová, dalo by sa dnes dohodnúť on-line konzultáciu? Ja som aj na fakulte, ale predpokladám, že on-line Vám bude vyhovovať viacej.',
        createdAt: DateTime.fromISO('2025-10-20T09:00:00'),
      },



      // ======================== NEJAKE RANDOM SPRAVY NA DOPLNENIE ========================

      {
        userId: 15,
        channelId: 3,
        mentions: [],
        text: 'FIIT DOD (deň otvorených dverí) – hľadáme dobrovoľníkov na stánky a navigáciu. Kto môže, napíšte časové okno pls.',
        createdAt: DateTime.fromISO('2025-10-18T09:05:00'),
      },
      {
        userId: 72,
        channelId: 3,
        mentions: [],
        text: 'Môžem 10:00–12:00.',
        createdAt: DateTime.fromISO('2025-10-18T09:06:00'),
      },
      {
        userId: 7,
        channelId: 3,
        mentions: [],
        text: 'Ja dám 12:00–14:00, keď bude treba.',
        createdAt: DateTime.fromISO('2025-10-18T09:06:20'),
      },
      {
        userId: 2,
        channelId: 3,
        mentions: [],
        text: 'Ja môžem byť na registrácii hodinku-dve, napíšte kde.',
        createdAt: DateTime.fromISO('2025-10-18T09:06:40'),
      },
      {
        userId: 83,
        channelId: 3,
        mentions: [],
        text: 'Môžem popri cvičení 14:00–15:30.',
        createdAt: DateTime.fromISO('2025-10-18T09:07:00'),
      },
      {
        userId: 78,
        channelId: 3,
        mentions: [],
        text: 'Ja len ráno, cca 9:00–10:30.',
        createdAt: DateTime.fromISO('2025-10-18T09:07:20'),
      },
      {
        userId: 90,
        channelId: 3,
        mentions: [],
        text: 'Dám aj celý deň, keď mi dáte tričko 😅',
        createdAt: DateTime.fromISO('2025-10-18T09:07:40'),
      },
      {
        userId: 14,
        channelId: 3,
        mentions: [],
        text: 'Ja môžem na guiding po priestoroch 11:00–13:00.',
        createdAt: DateTime.fromISO('2025-10-18T09:08:10'),
      },
      {
        userId: 69,
        channelId: 3,
        mentions: [],
        text: 'Mám labky, dám len 15:00–16:00.',
        createdAt: DateTime.fromISO('2025-10-18T09:08:30'),
      },
      {
        userId: 76,
        channelId: 3,
        mentions: [],
        text: 'Môžem na infopointe 10:00–11:30.',
        createdAt: DateTime.fromISO('2025-10-18T09:08:50'),
      },
      {
        userId: 82,
        channelId: 3,
        mentions: [],
        text: 'Ja môžem, ale až poobede. 16:00–18:00.',
        createdAt: DateTime.fromISO('2025-10-18T09:09:10'),
      },
      {
        userId: 15,
        channelId: 3,
        mentions: [],
        text: 'Super, vďaka. Zajtra hodím sheet s rozpisom.',
        createdAt: DateTime.fromISO('2025-10-18T09:09:40'),
      },

      {
        userId: 88,
        channelId: 3,
        mentions: [],
        text: 'FYI dnes nejde bočný vchod, je tam namrznuté na schodoch. Choďte radšej hlavným.',
        createdAt: DateTime.fromISO('2025-11-20T07:42:00'),
      },
      {
        userId: 20,
        channelId: 3,
        mentions: [],
        text: 'Potvrdzujem, SBS posiela všetkých dookola.',
        createdAt: DateTime.fromISO('2025-11-20T07:43:00'),
      },
      {
        userId: 73,
        channelId: 3,
        mentions: [],
        text: 'Vďaka, ušetrilo mi to 10 min pobehovania.',
        createdAt: DateTime.fromISO('2025-11-20T07:43:35'),
      },
      {
        userId: 15,
        channelId: 3,
        mentions: [],
        text: 'Dám to aj do pripnutých na dnes.',
        createdAt: DateTime.fromISO('2025-11-20T07:44:10'),
      },

      {
        userId: 15,
        channelId: 3,
        mentions: [],
        text: 'FIIT e-sport večer: LoL Flex + Marvel Rivals (št 19:00). Kto chce hrať za FIIT, napíšte sem, spravíme tímy.',
        createdAt: DateTime.fromISO('2025-11-12T12:15:00'),
      },
      {
        userId: 10,
        channelId: 3,
        mentions: [],
        text: 'LoL flex by som dal.',
        createdAt: DateTime.fromISO('2025-11-12T12:16:00'),
      },
      {
        userId: 9,
        channelId: 3,
        mentions: [],
        text: 'Ja môžem 19:00, ale len 2-3 hry.',
        createdAt: DateTime.fromISO('2025-11-12T12:16:20'),
      },
      {
        userId: 2,
        channelId: 3,
        mentions: [],
        text: 'Ja sa pridám na LoL, ak bude supp/adc.',
        createdAt: DateTime.fromISO('2025-11-12T12:16:45'),
      },
      {
        userId: 7,
        channelId: 3,
        mentions: [],
        text: 'Ja prídem pozrieť, možno aj zahrám ak bude voľné miesto.',
        createdAt: DateTime.fromISO('2025-11-12T12:17:10'),
      },
      {
        userId: 1,
        channelId: 3,
        mentions: [],
        text: 'Marvel Rivals beriem, potrebujem ešte 2 ľudí na tím.',
        createdAt: DateTime.fromISO('2025-11-12T12:17:40'),
      },
      {
        userId: 68,
        channelId: 3,
        mentions: [1],
        text: '@nikol45 ja môžem Rivals.',
        createdAt: DateTime.fromISO('2025-11-12T12:18:00'),
      },
      {
        userId: 79,
        channelId: 3,
        mentions: [1],
        text: '@nikol45 idem aj ja, ak sa rátam.',
        createdAt: DateTime.fromISO('2025-11-12T12:18:25'),
      },
      {
        userId: 14,
        channelId: 3,
        mentions: [],
        text: 'Kde sa to hrá, v laboch alebo niekde v chill zóne?',
        createdAt: DateTime.fromISO('2025-11-12T12:18:55'),
      },
      {
        userId: 15,
        channelId: 3,
        mentions: [],
        text: 'Chill zóna pri bufete, hodím ešte info večer.',
        createdAt: DateTime.fromISO('2025-11-12T12:19:20'),
      },

      {
        userId: 1,
        channelId: 6,
        mentions: [],
        text: 'FIIT e-sport dnes 19:00 – Marvel Rivals. Máme 3/5, hľadám ešte 2 ľudí.',
        createdAt: DateTime.fromISO('2025-11-12T18:05:00'),
      },
      {
        userId: 3,
        channelId: 6,
        mentions: [1],
        text: '@nikol45 ja môžem, som doma už.',
        createdAt: DateTime.fromISO('2025-11-12T18:05:30'),
      },
      {
        userId: 68,
        channelId: 6,
        mentions: [],
        text: 'Som in, len mi pošli invite.',
        createdAt: DateTime.fromISO('2025-11-12T18:06:00'),
      },
      {
        userId: 25,
        channelId: 6,
        mentions: [],
        text: 'I can fill. What role do you need?',
        createdAt: DateTime.fromISO('2025-11-12T18:06:20'),
      },
      {
        userId: 7,
        channelId: 6,
        mentions: [],
        text: 'Ja prídem na chvíľu, ale budem skôr pozerať než hrať.',
        createdAt: DateTime.fromISO('2025-11-12T18:06:50'),
      },
      {
        userId: 1,
        channelId: 6,
        mentions: [25],
        text: 'Need support/utility. Pingnem ti lobby.',
        createdAt: DateTime.fromISO('2025-11-12T18:07:15'),
      },

      {
        userId: 17,
        channelId: 5,
        mentions: [],
        text: 'FIIT flex tonight 19:00. Need 1 more, any role.',
        createdAt: DateTime.fromISO('2025-11-12T18:10:00'),
      },
      {
        userId: 10,
        channelId: 5,
        mentions: [],
        text: 'Ja môžem supp, mrkva717#EUNE.',
        createdAt: DateTime.fromISO('2025-11-12T18:10:20'),
      },
      {
        userId: 2,
        channelId: 5,
        mentions: [],
        text: 'Berem adc ak treba.',
        createdAt: DateTime.fromISO('2025-11-12T18:10:40'),
      },
      {
        userId: 31,
        channelId: 5,
        mentions: [],
        text: 'I can jungle. eng07#EUNE',
        createdAt: DateTime.fromISO('2025-11-12T18:11:05'),
      },
      {
        userId: 11,
        channelId: 5,
        mentions: [],
        text: 'Ja dám len jednu a potom ARAM.',
        createdAt: DateTime.fromISO('2025-11-12T18:11:30'),
      },
      {
        userId: 16,
        channelId: 5,
        mentions: [],
        text: 'Keep it friendly. Tournament = less trash talk.',
        createdAt: DateTime.fromISO('2025-11-12T18:12:00'),
      },


      // ========================
      // 4. Ženy na FIIT
      // channel_id = 4
      // ========================

      {
        userId: 1,
        channelId: 4,
        mentions: [],
        text: 'Čauko ženy moje, ako prežívate tento týždeň?',
        createdAt: DateTime.fromISO('2025-10-01T13:00:00'),
      },
      {
        userId: 2,
        channelId: 4,
        mentions: [],
        text: 'Som mŕtva z ICP, nechcem už Figmu ani vidieť',
        createdAt: DateTime.fromISO('2025-10-01T13:01:00'),
      },
      {
        userId: 4,
        channelId: 4,
        mentions: [],
        text: 'Ale máme to strašne super si myslim',
        createdAt: DateTime.fromISO('2025-10-01T13:02:00'),
      },
      {
        userId: 2,
        channelId: 4,
        mentions: [],
        text: 'Kámo ja som strašne hluuupa to čo som spavilaaa',
        createdAt: DateTime.fromISO('2025-10-01T13:04:00'),
      },
      {
        userId: 19,
        channelId: 4,
        mentions: [],
        text: 'No to lebo aj realne si',
        createdAt: DateTime.fromISO('2025-10-01T13:04:20'),
      },
      {
        userId: 2,
        channelId: 4,
        mentions: [],
        text: '??? tak to bolo od teba fakt hnusné',
        createdAt: DateTime.fromISO('2025-10-01T13:04:30'),
      },
      {
        userId: 4,
        channelId: 4,
        mentions: [],
        text: 'Tak toto bolo už moc, @nikol45 banni ju prosim, takéto tu u nás nebudeme akceptovať',
        createdAt: DateTime.fromISO('2025-10-01T13:05:00'),
      },
      {
        userId: 1,
        channelId: 4,
        mentions: [],
        text: 'vyhodim ťa ty had na krku',
        createdAt: DateTime.fromISO('2025-10-01T13:07:00'),
      },

      {
        userId: 1, // Nikol
        channelId: 4,
        mentions: [],
        text: 'BFFR',
        createdAt: DateTime.fromISO('2025-10-12T22:03:00'),
      },
      {
        userId: 4, // Simča
        channelId: 4,
        mentions: [],
        text: 'Ta pome spinkať 💤',
        createdAt: DateTime.fromISO('2025-10-12T22:04:00'),
      },
      {
        userId: 4,
        channelId: 4,
        mentions: [],
        text: 'Good nighty 🌃',
        createdAt: DateTime.fromISO('2025-10-12T22:04:30'),
      },
      {
        userId: 2, // Firefly
        channelId: 4,
        mentions: [],
        text: 'bruuu noc prajem ženy 💫💎',
        createdAt: DateTime.fromISO('2025-10-12T22:05:00'),
      },

      {
        userId: 4,
        channelId: 4,
        mentions: [2],
        text: 'Môže byť? @firefly96',
        createdAt: DateTime.fromISO('2025-10-13T09:31:00'),
      },
      {
        userId: 4,
        channelId: 4,
        mentions: [],
        text: 'poslala som ti na mess',
        createdAt: DateTime.fromISO('2025-10-13T09:31:30'),
      },
      {
        userId: 4,
        channelId: 4,
        mentions: [],
        text: 'Nie je to too much?',
        createdAt: DateTime.fromISO('2025-10-13T09:32:00'),
      },
      {
        userId: 1,
        channelId: 4,
        mentions: [],
        text: 'moze byyyt 😍',
        createdAt: DateTime.fromISO('2025-10-13T09:33:00'),
      },
      {
        userId: 4,
        channelId: 4,
        mentions: [],
        text: "It's out 😌",
        createdAt: DateTime.fromISO('2025-10-13T09:35:00'),
      },
      {
        userId: 1,
        channelId: 4,
        mentions: [],
        text: 'aaa vyzerá to perfektne 🔥',
        createdAt: DateTime.fromISO('2025-10-13T09:36:00'),
      },
      {
        userId: 4,
        channelId: 4,
        mentions: [],
        text: 'yayy konečne hotovo 😮‍💨',
        createdAt: DateTime.fromISO('2025-10-13T09:36:30'),
      },
      {
        userId: 1,
        channelId: 4,
        mentions: [],
        text: 'daj potom aj na story nech vidia 😎',
        createdAt: DateTime.fromISO('2025-10-13T09:37:00'),
      },
      {
        userId: 4,
        channelId: 4,
        mentions: [],
        text: 'maybeee 😏',
        createdAt: DateTime.fromISO('2025-10-13T09:38:00'),
      },

      {
        userId: 1,
        channelId: 4,
        mentions: [],
        text: 'ngl hento sa mi paci farebne',
        createdAt: DateTime.fromISO('2025-10-13T10:59:00'),
      },
      {
        userId: 2,
        channelId: 4,
        mentions: [],
        text: 'tomu ver',
        createdAt: DateTime.fromISO('2025-10-13T10:59:30'),
      },
      {
        userId: 1,
        channelId: 4,
        mentions: [],
        text: 'idem si spravit nechty nejake pekne jesenne muhehehe',
        createdAt: DateTime.fromISO('2025-10-13T11:00:00'),
      },
      {
        userId: 4,
        channelId: 4,
        mentions: [],
        text: 'uuu potom pošli 💅💅',
        createdAt: DateTime.fromISO('2025-10-13T11:01:00'),
      },
      {
        userId: 2,
        channelId: 4,
        mentions: [],
        text: '💅',
        createdAt: DateTime.fromISO('2025-10-13T11:02:00'),
      },
      {
        userId: 1,
        channelId: 4,
        mentions: [],
        text: '💅',
        createdAt: DateTime.fromISO('2025-10-13T11:05:00'),
      },
    ])
  }
}
