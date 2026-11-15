export type Listing = {
  id: string; slug?: string; category: string; title: string;
  description: string | null; capacity: number; is_open: boolean; created_at?: string;
};
export type ApplicationStatus = "applied" | "reading" | "delivered" | "completed";
export type Application = {
  id: string; listing_id: string | null; applicant_name: string; passphrase: string;
  consultation: string; status: ApplicationStatus; agreed: boolean; created_at?: string;
};
export type Message = {
  id: string; application_id: string; sender: "client" | "reader" | "system";
  body: string; created_at?: string;
};
export type ReadingPosition = { no: number; card: string; orientation: "正位置" | "逆位置"; text: string };
export type Reading = {
  id: string; application_id: string;
  positions: ReadingPosition[];
  conclusion: string; spotlight: string; key_message: string;
  final_text: string | null; created_at?: string;
};
export type Feedback = { id: string; application_id: string; body: string; created_at?: string };
