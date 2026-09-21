# Patches done

## Maps

- `start.village.village-02-beach` and `start.village.village-01-center`: Remove the cutscene of CL1 (which is set to always trigger and TP you out, so it locks you from entering the maps). (TODO is it still needed ?)
- `meta.game-start`: Intro cinematic, skip the main plot and teleport to Lyhamn
- `start.north.north-03-dungeon`: Modify the trigger for lowering the water level to an AP item. This is triggered through the `ap_tide` plot.
- `start.north.north-03-dungeon`: Remove the condition for Filia to join.
- `start.north.north-02-bridge` and `hub.south.south-06-bridge`: Modify the trigger for enabling the boat to an AP item, triggered through the `ap_boat` plot.
- `start.center.center-06`: patch to the `quickwood` quest: skip the end cutscene (that softlocks), prevent the crumbling platforms from disappearing, and require the combat to finish the quest (and this combat also requires the first part of the quest to trigger)
- `start.south.south-01-bamboo`: added a sign to tell players that the west bridge also requires CL1 (due to unlocking a CL1 quest).
- `start.north.north-04-bridge-island`, `start.peak.peak-02`, `start.south.south-01-bamboo`: patch getting the weapon: remove the barrier, make the pedestal permanent, don't equip the weapon, remove the gui/task messages that persist on the screen.
- `start.south.south-02-nest`, `start.dng.outer-2` and `hub.north.north-04-nyx-nest`: Spawn the boss and the nest/spire cutscene, and progress the plots used to track these events.

## Plots

The main plot progress is set to the end by the client on initialization.

- Implement the plots for the AP items: `ap_tide`, `ap_bridges`, `ap_lyhamn`, `ap_boat`.
- Remove conditions for starting and progressing main chapters on quests, to prevent a these quests to be done immediately.
- Remove conditions on some main quest progress, to prevent auto opening chests.
- Separate the Aether Dungeon from the main plot.
- Split the Aether Dungeon plot into two parts, so progressing on the second part doesn't skip the first one.
- Change the combat level of all areas.
- Remove the teleporter restrictions after getting a weapon or during some quest sequences.
- Add plots to track defeating story boss and weaving nests/spires: `ap_boss_valley`, `ap_boss_aether`, `ap_boss_plains`, `ap_nest_valley`, `ap_nest_plains`, `ap_spire_aether`.

## Misc

- Add options for increasing the drop rate and exp gains. These are put in an `"ARCHIPELAGO"` tab, which is defined in `lang/gui.json` and in a code patch.
