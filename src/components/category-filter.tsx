import { Grid, Icon } from "@raycast/api";
import { categories } from "../data";

export default function CategoryFilter({ active, onChange }: { active: string; onChange: (value: string) => void }) {
  return (
    <Grid.Dropdown value={active} tooltip="Category" onChange={onChange}>
      <Grid.Dropdown.Item icon={Icon.Tag} value="" title="All categories" />

      {categories.map((cat) => (
        <Grid.Dropdown.Item key={cat.name} icon={Icon.Tag} value={cat.name} title={cat.name} />
      ))}
    </Grid.Dropdown>
  );
}
