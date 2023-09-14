import { Action, ActionPanel, Detail, Grid, Icon, Color } from "@raycast/api";
import { templates } from "./data";
import { Template } from "./types";

function View({ template }: { template: Template }) {
  return (
    <Detail
      markdown={`![avatar](${template.src})`}
      metadata={
        <Detail.Metadata>
          <Detail.Metadata.TagList title="Tags">
            {template.tags.map((tag: string) => (
              <Detail.Metadata.TagList.Item key={tag} text={tag} />
            ))}
          </Detail.Metadata.TagList>

          <Detail.Metadata.TagList title="categories">
            {template.categories.map((cat: string) => (
              <Detail.Metadata.TagList.Item key={cat} text={cat} color={Color.Green} />
            ))}
          </Detail.Metadata.TagList>

          <Detail.Metadata.TagList title="Supertags">
            {template.supertags.map((tag: string) => (
              <Detail.Metadata.TagList.Item key={tag} text={tag} color={Color.Purple} />
            ))}
          </Detail.Metadata.TagList>

          <Detail.Metadata.Label title="template_id" text={template.template_id} />
          <Detail.Metadata.Label title="comic_id" text={template.comic_id} />
        </Detail.Metadata>
      }
      actions={
        <ActionPanel>
          <Action.CopyToClipboard title="Copy" content={template.src} />
          <Action.Paste title="Paste" content={template.src} />
        </ActionPanel>
      }
    />
  );
}

export default function Command() {
  return (
    <Grid columns={5} aspectRatio="1" fit={Grid.Fit.Fill}>
      {templates.map((template: Template) => {
        return (
          <Grid.Item
            key={template.src}
            title={template.alt_text ? template.alt_text : ""}
            keywords={template.tags}
            content={template.src}
            actions={
              <ActionPanel>
                <Action.Push icon={Icon.Eye} title="View" target={<View template={template} />} />
                <Action.CopyToClipboard title="Copy" content={template.src} />
                <Action.Paste title="Paste" content={template.src} />
              </ActionPanel>
            }
          />
        );
      })}
    </Grid>
  );
}
