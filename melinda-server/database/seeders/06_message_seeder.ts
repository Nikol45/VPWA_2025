import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Message from '#models/message'

export default class MessageSeeder extends BaseSeeder {
  async run() {
    await Message.createMany([
      // -----------------------------
      // Channel 4: Ženy na FIIT
      // Members: 1 (Nikol), 2 (Svetlana), 4 (Simča), 5 (Betka)
      // -----------------------------
      {
        userId: 1, // Nikol
        channelId: 4,
        mentions: [],
        text: 'BFFR',
      },
      {
        userId: 4, // Simča
        channelId: 4,
        mentions: [],
        text: 'Ta pome spinkať 💤',
      },
      {
        userId: 4,
        channelId: 4,
        mentions: [],
        text: 'Good nighty 🌌',
      },
      {
        userId: 2, // FireFly
        channelId: 4,
        mentions: [],
        text: 'bruuu noc prajem ženy 🌙💎',
      },
      {
        userId: 4,
        channelId: 4,
        mentions: [2],
        text: 'Môže byť? @firefly96',
      },
      {
        userId: 4,
        channelId: 4,
        mentions: [],
        text: 'poslala obrázok 🖼️',
      },
      {
        userId: 4,
        channelId: 4,
        mentions: [],
        text: 'Nie je to too much?',
      },
      {
        userId: 1,
        channelId: 4,
        mentions: [],
        text: 'moze byyyt 😍',
      },
      {
        userId: 4,
        channelId: 4,
        mentions: [],
        text: "It's out 😌",
      },
      {
        userId: 1,
        channelId: 4,
        mentions: [],
        text: 'aaa vyzerá to perfektne 🔥',
      },
      {
        userId: 4,
        channelId: 4,
        mentions: [],
        text: 'yayy konečne hotovo 🥺',
      },
      {
        userId: 1,
        channelId: 4,
        mentions: [],
        text: 'daj potom aj na story nech vidia 😎',
      },
      {
        userId: 4,
        channelId: 4,
        mentions: [],
        text: 'maybeee 🥺',
      },
      {
        userId: 1,
        channelId: 4,
        mentions: [],
        text: 'ngl hento sa mi paci farebne',
      },
      {
        userId: 5, // Betka
        channelId: 4,
        mentions: [],
        text: 'Vy dve ste kreativne queens, milujemmmm 💅✨',
      },
      {
        userId: 2,
        channelId: 4,
        mentions: [],
        text: 'Wau 😭',
      },

      // -----------------------------
      // Channel 1: Slováci na Mladosti
      // Members: 1,2,3,4,5,6
      // -----------------------------
      {
        userId: 1,
        channelId: 1,
        mentions: [],
        text: 'Kto ide dnes večer na intrákový pokec do kuchynky? 😄',
      },
      {
        userId: 3,
        channelId: 1,
        mentions: [],
        text: 'Ja prinesiem čipsy, niekto plsky nech zobere čaj alebo colu',
      },
      {
        userId: 6,
        channelId: 1,
        mentions: [],
        text: 'Môžem doniesť reproduktor, dáme si chill playlist 🎶',
      },
      {
        userId: 5,
        channelId: 1,
        mentions: [],
        text: 'Ja ale ráno vstávam, tak max do jedenástej pls 😅',
      },
      {
        userId: 2,
        channelId: 1,
        mentions: [6],
        text: '@lukas nezabudni konečne vrátiť ten hrnček z kuchynky 😂',
      },
      {
        userId: 6,
        channelId: 1,
        mentions: [2],
        text: '@firefly96 klídek, už som ho umyl, uplne ako novy 😎',
      },
      {
        userId: 4,
        channelId: 1,
        mentions: [],
        text: 'Idem si ešte dorobiť projekt a potom sa pridám.',
      },
      {
        userId: 1,
        channelId: 1,
        mentions: [],
        text: 'Tak platí, o deviatej sa stretneme na 3. poschodí ✨',
      },

      // -----------------------------
      // Channel 2: Tretiačikovia
      // Members: 1,2,4
      // -----------------------------
      {
        userId: 4,
        channelId: 2,
        mentions: [],
        text: 'Máte už hotové zadanie z VAVY? Lebo ja som úplne stratená 😭',
      },
      {
        userId: 1,
        channelId: 2,
        mentions: [],
        text: 'Ja mám rozrobené, ale ešte mi chýba polka testov.',
      },
      {
        userId: 2,
        channelId: 2,
        mentions: [],
        text: 'Môžeme si večer spraviť call a prejsť si to spolu.',
      },
      {
        userId: 4,
        channelId: 2,
        mentions: [2],
        text: '@firefly96 ty si náš záchranca, bez teba by sme to nedali 🫶',
      },
      {
        userId: 1,
        channelId: 2,
        mentions: [],
        text: 'Dáme si pair programming a kávu, inak to nepôjde ☕',
      },
      {
        userId: 2,
        channelId: 2,
        mentions: [],
        text: 'Pošlite mi kód sem do DM a ja to kuknem predtým.',
      },

      // -----------------------------
      // Channel 3: FIITka
      // Members: 1,2,3,4,6
      // -----------------------------
      {
        userId: 3,
        channelId: 3,
        mentions: [],
        text: 'Vie niekto, či bude z algoritmov aj bonusový test?',
      },
      {
        userId: 6,
        channelId: 3,
        mentions: [],
        text: 'Myslím, že spomínal niečo na prednáške, ale neviem presne kedy.',
      },
      {
        userId: 1,
        channelId: 3,
        mentions: [],
        text: 'Na discorde FIITky písali, že bude formou domácej úlohy.',
      },
      {
        userId: 2,
        channelId: 3,
        mentions: [],
        text: 'Ak bude, tak dúfam, že to nebude ďalší brutálny grafový príklad 😅',
      },
      {
        userId: 4,
        channelId: 3,
        mentions: [],
        text: 'Ja by som radšej niečo s dynamickým programovaním, to ešte ako-tak chápem.',
      },
      {
        userId: 3,
        channelId: 3,
        mentions: [],
        text: 'Každopádne by sme si mohli spraviť spoločný dokument a riešiť to spolu.',
      },
      {
        userId: 1,
        channelId: 3,
        mentions: [3],
        text: '@Svatec super nápad, hoď link keď ho vytvoríš 🙏',
      },

      // -----------------------------
      // Channel 5: CEO
      // Members: 2,1
      // -----------------------------
      {
        userId: 2,
        channelId: 5,
        mentions: [],
        text: 'Tak šéfovia, ako ide náš side projekt? 😎',
      },
      {
        userId: 1,
        channelId: 5,
        mentions: [],
        text: 'Frontend som už prefarbila do našich pastelových farieb, je to cute.',
      },
      {
        userId: 2,
        channelId: 5,
        mentions: [],
        text: 'Backend API už tiež beží, ešte doladiť auth a sme kingovia.',
      },
      {
        userId: 1,
        channelId: 5,
        mentions: [],
        text: 'Potom môžeme spraviť demo a dať to do portfólia ✨',
      },

      // -----------------------------
      // Channel 6: Marvel Rivals
      // Members: 1,3
      // -----------------------------
      {
        userId: 3,
        channelId: 6,
        mentions: [],
        text: 'Kto ide večer Marvel Rivals? Potrebujem tím na ranked 😤',
      },
      {
        userId: 1,
        channelId: 6,
        mentions: [],
        text: 'Ja môžem okolo deviatej, ale budem feediť, som rusty 😭',
      },
      {
        userId: 3,
        channelId: 6,
        mentions: [],
        text: 'Nevadí, hlavne že bude sranda. Zoberieme aj niekoho z LoL kanálu?',
      },

      // -----------------------------
      // Channel 7: League of Legends
      // Members: 2,6
      // -----------------------------
      {
        userId: 6,
        channelId: 7,
        mentions: [],
        text: 'Dnes flexky? Chcem vyskúšať nového champa.',
      },
      {
        userId: 2,
        channelId: 7,
        mentions: [],
        text: 'Ak nebudeš intovať, tak idem 😂',
      },
      {
        userId: 6,
        channelId: 7,
        mentions: [],
        text: 'Sľubujem nič nefeednem… možno 😇',
      },

      // -----------------------------
      // Channel 8: Študovňa
      // Members: 1,3,2,6
      // -----------------------------
      {
        userId: 1,
        channelId: 8,
        mentions: [],
        text: 'O 18:00 idem do študovne, kto sa pridá?',
      },
      {
        userId: 3,
        channelId: 8,
        mentions: [],
        text: 'Ja prídem, potrebujem focusnut na matiku.',
      },
      {
        userId: 2,
        channelId: 8,
        mentions: [],
        text: 'Donesiem si notebook, ideme riešiť aj webku.',
      },
      {
        userId: 6,
        channelId: 8,
        mentions: [],
        text: 'Ak bude voľná zásuvka, tak sa pridám tiež.',
      },
      {
        userId: 1,
        channelId: 8,
        mentions: [2, 3],
        text: '@firefly96 @Svatec môžeme spraviť mini konzultačky medzi učením.',
      },
    ])
  }
}
