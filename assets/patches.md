# Patches done

## Maps

- `start.village.village-02-beach` and `start.village.village-01-center`: Remove the cutscene of CL1 (which is set to always trigger and TP you out, so it locks you from entering the maps). (TODO is it still needed ?)
- `meta.game-start`: Intro cinematic, skip the main plot and teleport to Lyhamn
- `start.north.north-03-dungeon`: Modify the trigger for lowering the water level to an AP item. This is triggered through the `ap_tide` plot.
- `start.north.north-03-dungeon`: Remove the condition for Filia to join.
- `start.north.north-02-bridge` and `hub.south.south-06-bridge`: Modify the trigger for enabling the boat to an AP item, triggered through the `ap_boat` plot.
- `start.center.center-06`: patch to the `quickwood` quest: skip the end cutscene (that softlocks), prevent the crumbling platforms from disappearing. (TODO can maybe be removed)
- `start.south.south-01-bamboo`: remove a Nyx barrier so you can leave if you don't have Blunt.

## Plots

The main plot progress is set to the end by the client on initialization.

- Implement the plots for the AP items: `ap_tide`, `ap_bridges`, `ap_lyhamn`, `ap_boat`.
- Remove conditions for starting and progressing main chapters on quests, to prevent a these quests to be done immediately.
- Remove conditions on some main quest progress, to prevent auto opening chests.
- Separate the Aether Dungeon from the main plot.
- Split the Aether Dungeon plot into two parts, so progressing on the second part doesn't skip the first one.
- Change the combat level of all areas.
