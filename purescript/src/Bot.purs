module Bot (main) where

import Prelude

foreign import data Robot :: # Type

main :: Robot -> Eff Unit
main robot = pure unit
