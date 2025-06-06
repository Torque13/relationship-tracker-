import { ReactElement } from "react";
import {
  StageBase,
  InitialData,
  Message,
  StageResponse,
  LoadResponse
} from "@chub-ai/stages-ts";

import ledgerSeed from "./assets/relationship_char.json";

/* ---------- Types ---------- */
type LedgerSchema = typeof ledgerSeed;
type InitState    = { seed: LedgerSchema };
type MessageState = { ledger: LedgerSchema };
type ChatState    = unknown;
type ConfigType   = unknown;

/* ---------- Headless Relationship Stage ---------- */
export class Stage extends StageBase<
  InitState,
  ChatState,
  MessageState,
  ConfigType
> {
  constructor(
    data: InitialData<InitState, ChatState, MessageState, ConfigType>
  ) {
    super(data);
  }

  /* Runs once per chat */
  async load(): Promise<Partial<LoadResponse<
    InitState,
    ChatState,
    MessageState
  >>> {
    return {
      initState:    { seed: ledgerSeed },
      messageState: { ledger: structuredClone(ledgerSeed) }
    };
  }

  /* No prompt injection yet */
  async beforePrompt(
    _user: Message
  ): Promise<Partial<StageResponse<ChatState, MessageState>>> {
    return {};
  }

  /* Example decay‑only logic — adjust yours later */
  async afterResponse(
    _bot: Message
  ): Promise<Partial<StageResponse<ChatState, MessageState>>> {
    // simple decay each turn
    const working = structuredClone(this.messageState.ledger);
    Object.values(working.metrics).forEach((m: any) => {
      m.value -= m.decay;
    });
    return { messageState: { ledger: working } };
  }

  /* No visible UI */
  render(): ReactElement {
    return <></>;
  }
}

export default Stage;
