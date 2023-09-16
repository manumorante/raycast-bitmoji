import { Grid, Icon } from "@raycast/api";
import { friends } from "./data";

export default function FriendsDropdown({ active, onChange }: { active: string; onChange: (value: string) => void }) {
  return (
    <Grid.Dropdown defaultValue={active} storeValue tooltip="People" onChange={onChange}>
      <Grid.Dropdown.Section title="People">
        {friends.map((friend, i) => (
          <Grid.Dropdown.Item
            icon={Icon.Person}
            key={friend.id}
            value={friend.id}
            title={`${friend.name || `Friend ${i}`}`}
          />
        ))}
      </Grid.Dropdown.Section>
    </Grid.Dropdown>
  );
}
