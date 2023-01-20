import { PropertyDeclaration, SourceFile } from "ts-morph";

export type PostprocessCallback = (source: SourceFile) => void;

interface StoreDecorator {
  declaration: PropertyDeclaration;
  module: string;
  identifier: string;
}

export interface StoreGetter extends StoreDecorator {
  getter: string;
}

export interface StoreAction extends StoreDecorator {
  action: string;
}
export interface StoreMutation extends StoreDecorator {
  mutation: string;
}
