import { ToggleButton, ToggleButtonGroup } from '@mui/material';

interface Props {
  categories: string[];
  selected: string;
  onChange: (category: string) => void;
}

const CategoryFilter = ({ categories, selected, onChange }: Props) => (
  <ToggleButtonGroup
    value={selected}
    exclusive
    onChange={(_, val: string | null) => val && onChange(val)}
    sx={{ flexWrap: 'wrap', justifyContent: 'center', gap: 0.5 }}
  >
    {categories.map(cat => (
      <ToggleButton
        key={cat}
        value={cat}
        sx={{ px: 3, py: 0.8, borderRadius: '20px !important', border: '1.5px solid !important', fontWeight: 600 }}
      >
        {cat}
      </ToggleButton>
    ))}
  </ToggleButtonGroup>
);

export default CategoryFilter;
