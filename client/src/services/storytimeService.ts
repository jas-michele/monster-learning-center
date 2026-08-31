import derrickHoldingBook from '../assets/storytime/derrick-holding-book.png'

import page1 from '../assets/storytime/Page1.png'
import page2 from '../assets/storytime/Page2.png'
import page3 from '../assets/storytime/Page3.png'
import page4 from '../assets/storytime/Page4.png'
import page5 from '../assets/storytime/Page5.png'
import page6 from '../assets/storytime/Page6.png'
import page7 from '../assets/storytime/Page7.png'

export type StorySpread = {
  id: string | number
  leftText: string
  titleOnly?: boolean
  endOnly?: boolean
  rightImageUrl?: string
  imagePresentation?: 'cover' | 'avatar'
  imageAlt?: string
  turnBackText?: string[]
  turnBackImageUrl?: string
  turnBackImageAlt?: string
  narrationUrl?: string
}

export type GeneratedStory = {
  id: string
  title: string
  spreads: StorySpread[]
}

export async function getStorytimeStory(
  signal?: AbortSignal
): Promise<GeneratedStory> {
  await new Promise<void>((resolve, reject) => {
    const timeoutId = window.setTimeout(resolve, 420)

    signal?.addEventListener(
      'abort',
      () => {
        window.clearTimeout(timeoutId)
        reject(
          new DOMException(
            'Story request was cancelled.',
            'AbortError'
          )
        )
      },
      { once: true }
    )
  })

  return {
    id: 'derrick-lost-trex',

    title: 'Derrick and the Lost T-Rex',

    spreads: [
      // TITLE
      {
        id: 'start',
        leftText: '',
        titleOnly: true,

        rightImageUrl: derrickHoldingBook,
        imagePresentation: 'avatar',

        imageAlt:
          'Derrick holding his Storytime book.',
      },

      // PAGE 1
      {
        id: 'restaurant',

        leftText:
          'Derrick went to the T-Rex restaurant for an adventure. Then he heard a tiny sound. "Roar?"',

        rightImageUrl: page1,

        imageAlt:
          'Derrick arriving at the T-Rex restaurant.',

        turnBackText: [
          'Derrick went to the T-Rex restaurant.',
          'Then he heard a tiny roar.',
        ],

        turnBackImageUrl: page1,

        turnBackImageAlt:
          'Derrick arriving at the T-Rex restaurant.',
      },

      // PAGE 2
      {
        id: 'little-trex',

        leftText:
          'Derrick found a little T-Rex all alone. "I can’t find my family," said the little dinosaur. Derrick smiled. "I’ll help you!"',

        rightImageUrl: page2,

        imageAlt:
          'Derrick meeting a little lost T-Rex.',

        turnBackText: [
          'The little T-Rex was lost.',
          'Derrick promised to help.',
        ],

        turnBackImageUrl: page2,

        turnBackImageAlt:
          'Derrick meeting the little lost T-Rex.',
      },

      // PAGE 3
      {
        id: 'triceratops',

        leftText:
          'They found Triceratops nearby. Derrick asked, "Have you seen the T-Rex family?" Triceratops said, "I saw BIG footprints by the trees!"',

        rightImageUrl: page3,

        imageAlt:
          'Derrick and the little T-Rex asking Triceratops for help.',

        turnBackText: [
          'They asked Triceratops for help.',
          'He saw big footprints by the trees!',
        ],

        turnBackImageUrl: page3,

        turnBackImageAlt:
          'Triceratops giving Derrick a clue.',
      },

      // PAGE 4
      {
        id: 'footprints',

        leftText:
          'Derrick and the little T-Rex followed the footprints. STOMP! STOMP! STOMP! But suddenly... the tracks disappeared!',

        rightImageUrl: page4,

        imageAlt:
          'Derrick and the little T-Rex following giant dinosaur footprints.',

        turnBackText: [
          'STOMP! STOMP! STOMP!',
          'They followed the giant footprints.',
        ],

        turnBackImageUrl: page4,

        turnBackImageAlt:
          'Derrick and the little T-Rex following dinosaur tracks.',
      },

      // PAGE 5
      {
        id: 'stegosaurus',

        leftText:
          'They found Stegosaurus. Derrick asked, "Do you know where the T-Rex family went?" Stegosaurus said, "I heard a BIG roar that way!"',

        rightImageUrl: page5,

        imageAlt:
          'Derrick asking Stegosaurus about the T-Rex family.',

        turnBackText: [
          'Stegosaurus had another clue.',
          'He heard a BIG roar!',
        ],

        turnBackImageUrl: page5,

        turnBackImageAlt:
          'Stegosaurus giving Derrick another clue.',
      },

      // PAGE 6
      {
        id: 'lunch',

        leftText:
          'But Derrick’s tummy went GRRRR! Time for a lunch break! Derrick had nuggets and fries, and his dinosaur friend ate too. Then... ROOOAAAR! Derrick jumped up. "That’s them!"',

        rightImageUrl: page6,

        imageAlt:
          'Derrick and the little T-Rex eating nuggets and fries.',

        turnBackText: [
          'Derrick stopped for nuggets and fries.',
          'Then they heard a giant ROAR!',
        ],

        turnBackImageUrl: page6,

        turnBackImageAlt:
          'Derrick and his dinosaur friend having lunch.',
      },

      // PAGE 7
      {
        id: 'family',

        leftText:
          'They followed the roar, and there was the T-Rex family! The little T-Rex ran to them. "We found your family!" Derrick cheered. Everyone gave one giant ROOOAAAR!',

        rightImageUrl: page7,

        imageAlt:
          'Derrick celebrating with the little T-Rex and its family.',

        turnBackText: [
          'They found the T-Rex family!',
          'Everyone celebrated together.',
        ],

        turnBackImageUrl: page7,

        turnBackImageAlt:
          'Derrick celebrating with the T-Rex family.',
      },

      // END
      {
        id: 'the-end',
        leftText: 'The end.',
        endOnly: true,
      },
    ],
  }
}