import { Action, ActionPanel, Grid } from "@raycast/api";
import { brands, outfits, addID } from "./data";
import { Outfit } from "./types";

export default function Outfits() {
  return (
    <Grid
      columns={4}
      aspectRatio="9/16"
      fit={Grid.Fit.Contain}
      inset={Grid.Inset.Small}
      searchBarPlaceholder="Search Brands"
    >
      {brands.map((brand) => {
        return (
          <Grid.Section title={brand.title} key={brand.id}>
            <Grid.Item content={brand.src} />
            {outfits
              .filter((outfit) => outfit.brand === brand.id)
              .map((outfit: Outfit) => {
                const src = addID({ src: outfit.src });
                return (
                  <Grid.Item
                    key={src}
                    content={src}
                    keywords={[...brand.title.split(" ")]}
                    actions={
                      <ActionPanel>
                        <Action.CopyToClipboard title="Copy" content={src} />
                      </ActionPanel>
                    }
                  />
                );
              })}
          </Grid.Section>
        );
      })}
    </Grid>
  );
}
