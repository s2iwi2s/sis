export interface IReport {
  base64Data?: string | null;
  binaryData?: string | null;
  fileName?: string | null;
}

export type NewReport = Omit<IReport, 'id'> & { id: null };
