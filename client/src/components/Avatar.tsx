import { AnimatePresence, motion, useReducedMotion, type Transition } from 'framer-motion'
import casualAvatar from '../assets/avatars/casual.png'
import mechanicAvatar from '../assets/avatars/mechanic.png'
import raceAvatar from '../assets/avatars/race.png'
import safariAvatar from '../assets/avatars/safari.png'
import storytimeAvatar from '../assets/avatars/storytime.png'

export type AvatarOutfit = 'casual' | 'mechanic' | 'race' | 'safari' | 'storytime'
export type AvatarAnimation = 'idle' | 'wave' | 'jump' | 'celebrate' | 'walk'

type AvatarProps = {
  outfit: AvatarOutfit
  animation: AvatarAnimation
  className?: string
  alt?: string
}

const avatarByOutfit: Record<AvatarOutfit, string> = {
  casual: casualAvatar,
  mechanic: mechanicAvatar,
  race: raceAvatar,
  safari: safariAvatar,
  storytime: storytimeAvatar,
}

const animationByName: Record<AvatarAnimation, { animate: Record<string, number | number[]>; transition: Transition }> = {
  idle: {
    animate: {
      y: [0, -8, 0],
      scale: [1, 1.015, 1],
      rotate: 0,
      x: 0,
    },
    transition: {
      duration: 3.2,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
  wave: {
    animate: {
      rotate: [0, -2.5, 3, -2, 0],
      y: [0, -3, 0, -2, 0],
      scale: [1, 1.01, 1],
      x: 0,
    },
    transition: {
      duration: 1.15,
      repeat: Infinity,
      repeatDelay: 0.25,
      ease: 'easeInOut',
    },
  },
  jump: {
    animate: {
      y: [0, 10, -28, 0],
      scaleX: [1, 1.06, 0.96, 1],
      scaleY: [1, 0.94, 1.08, 1],
      rotate: 0,
      x: 0,
    },
    transition: {
      duration: 0.8,
      repeat: Infinity,
      repeatDelay: 0.45,
      ease: 'easeInOut',
    },
  },
  celebrate: {
    animate: {
      y: [0, -22, 0, -16, 0],
      rotate: [0, -4, 3, -2, 0],
      scale: [1, 1.04, 1, 1.03, 1],
      x: 0,
    },
    transition: {
      duration: 1,
      repeat: Infinity,
      repeatDelay: 0.55,
      ease: 'easeOut',
    },
  },
  walk: {
    animate: {
      x: [-8, 8, -8],
      y: [0, -5, 0, -4, 0],
      rotate: [-1.5, 1.5, -1.5],
      scale: 1,
    },
    transition: {
      duration: 1.05,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
}

const reducedMotionAnimation = {
  animate: {
    y: 0,
    x: 0,
    rotate: 0,
    scale: 1,
    scaleX: 1,
    scaleY: 1,
  },
  transition: {
    duration: 0.2,
  },
}

function getOutfitLabel(outfit: AvatarOutfit) {
  return outfit === 'storytime' ? 'storytime' : outfit
}

export default function Avatar({
  outfit,
  animation,
  className,
  alt = `${getOutfitLabel(outfit)} avatar`,
}: AvatarProps) {
  const prefersReducedMotion = useReducedMotion()
  const motionConfig = prefersReducedMotion ? reducedMotionAnimation : animationByName[animation]

  return (
    <span className={className} aria-label={alt}>
      <AnimatePresence mode="wait" initial={false}>
        <motion.img
          key={outfit}
          src={avatarByOutfit[outfit]}
          alt={alt}
          draggable={false}
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, ...motionConfig.animate }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{
            opacity: { duration: 0.18, ease: 'easeOut' },
            scale: { duration: 0.2, ease: 'easeOut' },
            ...motionConfig.transition,
          }}
          style={{
            width: '100%',
            height: '100%',
            display: 'block',
            objectFit: 'contain',
            objectPosition: 'center bottom',
            pointerEvents: 'none',
            transformOrigin: '50% 100%',
            willChange: 'transform, opacity',
          }}
        />
      </AnimatePresence>
    </span>
  )
}
