// Import all your product images
import sirChewsALot from './assets/images/sir-chews-a-lot.png';
import barkKnight from './assets/images/bark-knight.png';
import sniffNShred from './assets/images/sniff-n-shred.png';
import laserMmayham from './assets/images/laser-mayham.png';
import whiskerTwister from './assets/images/whisker-twister.png';
import pawdicure from './assets/images/pawdicure.png';
import nailIt from './assets/images/nail-it.png';
import muttMakeover from './assets/images/mutt-makeover.png';
import floofLift from './assets/images/floof-lift.png';
import shedHappens from './assets/images/shed-happens.png';
import felineFettucine from './assets/images/feline-fettucine.png';
import clawSomeCasserole from './assets/images/claw-some-casserole.png';
import pawThaiCurry from './assets/images/paw-thai-curry.png';
import howlinHotpot from './assets/images/howlin-hotpot.png';
import pupperoniDeluxe from './assets/images/pupperoni-deluxe.png';
import tacos from './assets/images/tacos.png';
import barkRibs from './assets/images/bark-ribs.png';
import pounceATron from './assets/images/pounce-a-tron.png';
// ... import all other images here

// This map connects the path from your database to the imported image
const imageMap = {
  '/images/sir-chews-a-lot.png': sirChewsALot,
  '/images/bark-knight.png': barkKnight,
  '/images/sniff-n-shred.png': sniffNShred,
  '/images/laser-mayham.png': laserMmayham,
  '/images/whisker-twister.png': whiskerTwister,
  '/images/pawdicure.png': pawdicure,
  '/images/nail-it.png': nailIt,
  '/images/mutt-makeover.png': muttMakeover,
  '/images/floof-lift.png': floofLift,
  '/images/shed-happens.png': shedHappens,
  '/images/feline-fettucine.png': felineFettucine,
  '/images/claw-some-casserole.png': clawSomeCasserole,
  '/images/paw-thai-curry.png': pawThaiCurry,
  '/images/howlin-hotpot.png': howlinHotpot,
  '/images/pupperoni-deluxe.png': pupperoniDeluxe,
  '/images/tacos.png': tacos,
  '/images/bark-ribs.png': barkRibs,
  '/images/pounce-a-tron.png': pounceATron,
  // ... add all your other image mappings here
};

// This function will find the correct image based on the path
// If it can't find one, it provides a placeholder
export const getImage = (path) => {
  return imageMap[path] || 'https://placehold.co/300x300/EEE/31343C?text=Image+Not+Found';
};