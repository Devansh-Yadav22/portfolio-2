export interface HiddenCellFact {
  id: number;
  title: string;
  category: string;
  detail: string;
  // normalized coordinates on the lattice grid
  coord: [number, number];
}

export const HIDDEN_CELLS: HiddenCellFact[] = [
  {
    id: 1,
    title: 'CodSoft Internship',
    category: 'Experience',
    detail: 'Java Developer Intern at CodSoft (June 2025 to July 2025). Built Java applications while strengthening OOP foundations and structured problem solving.',
    coord: [-3, 5],
  },
  {
    id: 2,
    title: 'Matrix 2.0 Tech Fest',
    category: 'Recognition',
    detail: '2nd Runner-up at Matrix 2.0 Tech Fest as an active core team member.',
    coord: [4, -4],
  },
  {
    id: 3,
    title: 'Smart India Hackathon',
    category: 'Hackathon',
    detail: 'Participated with team Bee-Tech for SIH problem statement SIH26021 (Honey Mission), engineering the Honey Chain blockchain prototype.',
    coord: [-6, -2],
  },
  {
    id: 4,
    title: 'Fading-Echoes',
    category: 'Music',
    detail: 'Sings, plays acoustic guitar, writes poetry and shayari, and collaborates as part of the independent band Fading-Echoes.',
    coord: [5, 6],
  },
  {
    id: 5,
    title: 'Early Systems',
    category: 'Projects',
    detail: 'Built an Airline Reservation System using Java, JDBC and MySQL, alongside SynthNews—an exploratory news platform UI and branding concept.',
    coord: [1, -7],
  },
];
