
export type TravelInput = {
  lugar: string;
  transporte: string;
  dias: string;
};

export type Travel = {
  id: string; // el JSON tiene "1125" como string, ajusta según tu fuente
  input: TravelInput;
  post?: string;
};
