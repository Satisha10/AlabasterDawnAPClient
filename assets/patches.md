# Patches done

## Maps

- `start.village.village-02-beach` and `start.village.village-01-center`: Remove the cutscene of CL1 (which is set to always trigger and TP you out, so it locks you from entering the maps).
- `capital.north.north-01`: Intro map, skip the first trigger and instead teleport to Lyhamn.
- `start.north.north-03-dungeon`: Modify the trigger for lowering the water level to an AP item. This is triggered through the `ap_tide` plot.
- `start.north.north-03-dungeon`: Remove the condition for Filia to join.
- `start.north.north-02-bridge` and `hub.south.south-06-bridge`: Modify the trigger for enabling the boat to an AP item, triggered through the `ap_boat` plot.

## Plots

The main plot progress is set to the end by the client on initialization.

- Implement the plots for the AP items: `ap_tide`, `ap_bridges`, `ap_lyhamn`, `ap_boat`.
- Remove conditions for starting and progressing main chapters on quests, to prevent a these quests to be done immediately.
- Remove conditions on some main quest progress, to prevent auto opening chests.
- Separated the Aether Dungeon from the main plot.
