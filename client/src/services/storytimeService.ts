import derrickHoldingBook from '../assets/storytime/derrick-holding-book.png'
import derrickSmallDinoStory from '../assets/storytime/derrick-small-dino-story.png'
import derrickNextReadingAdventure from '../assets/storytime/derrick-next-reading-adventure.png'

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

export async function getStorytimeStory(signal?: AbortSignal): Promise<GeneratedStory> {
  await new Promise<void>((resolve, reject) => {
    const timeoutId = window.setTimeout(resolve, 420)

    signal?.addEventListener('abort', () => {
      window.clearTimeout(timeoutId)
      reject(new DOMException('Story request was cancelled.', 'AbortError'))
    }, { once: true })
  })

  return {
    id: 'mock-storytime-adventure',
    title: "Derrick's 3rd Birthday Adventure",
    spreads: [
      {
        id: 'start',
        leftText: '',
        titleOnly: true,
        rightImageUrl: derrickHoldingBook,
        imagePresentation: 'avatar',
        imageAlt: 'Derrick holding his storytime book.',
        turnBackText: ['Derrick opened his birthday book.', 'A golden path sparkled inside.'],
        turnBackImageUrl: derrickSmallDinoStory,
        turnBackImageAlt: 'Derrick reading a birthday adventure book with a small dinosaur.',
      },
      {
        id: 'middle',
        leftText: 'Derrick opened his birthday book. A golden path sparkled inside, leading him toward a gentle dinosaur friend.',
        rightImageUrl: derrickSmallDinoStory,
        imageAlt: 'Derrick reading a birthday adventure book with a small dinosaur.',
        turnBackText: ['Derrick opened his birthday book.', 'A golden path sparkled inside.'],
        turnBackImageUrl: derrickSmallDinoStory,
        turnBackImageAlt: 'Derrick reading a birthday adventure book with a small dinosaur.',
      },
      {
        id: 'end',
        leftText: 'When the last page shimmered, Derrick smiled. The best stories were the ones that made him feel ready for one more adventure.',
        rightImageUrl: derrickNextReadingAdventure,
        imageAlt: 'Derrick smiling excitedly with a storybook, ready for another reading adventure.',
        turnBackText: ['Derrick made one birthday wish.', 'The story glowed one last time.'],
        turnBackImageUrl: derrickNextReadingAdventure,
        turnBackImageAlt: 'Derrick smiling excitedly with a storybook, ready for another reading adventure.',
      },
      {
        id: 'the-end',
        leftText: 'The end.',
        endOnly: true,
      },
    ],
  }
}
