import '../Home/Home.css'
import { useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import garageBg from '../../assets/garagBG.png'
import monsterTruck from '../../assets/monsterTruck.png'
import Avatar from '../../components/Avatar'
import PlayAreaNav from '../../components/PlayAreaNav'

export default function Mechanic() {
  const [hasEntered, setHasEntered] = useState(false)
  const prefersReducedMotion = useReducedMotion()

  return (
    <div className="home" role="main" aria-label="Mechanic shop">
      <div className="home__scene-frame">
        <div className="home__scene">
          <div className="home__bg mechanic__bg" style={{ backgroundImage: `url(${garageBg})` }} aria-hidden />
          <img src={monsterTruck} alt="" className="mechanic__monster-truck" aria-hidden />
          <motion.div
            className="mechanic__avatar-wrap"
            aria-hidden
            initial={prefersReducedMotion ? false : { x: '240%' }}
            animate={{ x: 0 }}
            transition={{ duration: prefersReducedMotion ? 0 : 3.2, ease: 'easeInOut' }}
            onAnimationComplete={() => setHasEntered(true)}
          >
            <Avatar outfit="mechanic" animation={hasEntered || prefersReducedMotion ? 'stand' : 'walk'} className="mechanic__avatar" />
          </motion.div>
          <PlayAreaNav mechanicAsHome />
        </div>
      </div>
    </div>
  )
}
