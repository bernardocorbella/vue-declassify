import {
  ClassDeclaration,
  GetAccessorDeclaration,
  MethodDeclaration,
  PropertyAssignment,
  PropertyDeclaration,
  SetAccessorDeclaration,
} from "ts-morph";
import { unpackPropDecorator } from "./unpackPropDecorator";
import { unpackPropSyncDecorator } from "./unpackPropSyncDecorator";
import { unpackStoreActionDecorator } from "./unpackStoreActionDecorator";
import { unpackStoreGetterDecorator } from "./unpackStoreGetterDecorator";
import { unpackStoreMutationDecorator } from "./unpackStoreMutationDecorator";
import { unpackWatchDecorator } from "./unpackWatchDecorator";
import { StoreGetter, StoreAction, StoreMutation } from "./interface";

// Unpacks a Vue class declaration into its Vue properties.
export function unpackClass(declaration: ClassDeclaration) {
  const props: {
    declaration: PropertyDeclaration;
    default?: PropertyAssignment;
    required?: PropertyAssignment;
  }[] = [];

  const syncProps: {
    declaration: PropertyDeclaration;
    sync: string;
    default?: PropertyAssignment;
    required?: PropertyAssignment;
  }[] = [];

  const storeGetters: StoreGetter[] = [];
  const storeActions: StoreAction[] = [];
  const storeMutations: StoreMutation[] = [];

  const data: PropertyDeclaration[] = [];
  const methods: MethodDeclaration[] = [];

  const computed: Record<
    string,
    {
      getter?: GetAccessorDeclaration;
      setter?: SetAccessorDeclaration;
    }
  > = {};

  const watches: {
    path: string;
    method: string;
    immediate?: string;
    deep?: string;
  }[] = [];

  for (const property of declaration.getInstanceProperties()) {
    if (property instanceof PropertyDeclaration) {
      {
        const decorator = property.getDecorator("Prop");

        if (decorator) {
          props.push({
            declaration: property,
            ...unpackPropDecorator(decorator),
          });

          continue; // Processed it, so continue.
        }
      }

      {
        const decorator = property.getDecorator("PropSync");

        if (decorator) {
          syncProps.push({
            declaration: property,
            ...unpackPropSyncDecorator(decorator),
          });

          continue; // Processed it, so continue.
        }
      }

      {
        const decorator = property.getDecorator("Getter");
        if (decorator) {
          storeGetters.push({
            declaration: property,
            identifier: property.getName(),
            ...unpackStoreGetterDecorator(decorator),
          });

          continue;
        }
      }

      {
        const decorator = property.getDecorator("Action");
        if (decorator) {
          storeActions.push({
            declaration: property,
            identifier: property.getName(),
            ...unpackStoreActionDecorator(decorator),
          });

          continue;
        }
      }

      {
        const decorator = property.getDecorator("Mutation");
        if (decorator) {
          storeMutations.push({
            declaration: property,
            identifier: property.getName(),
            ...unpackStoreMutationDecorator(decorator),
          });

          continue;
        }
      }

      // Undecorated property, so it's plain old data.
      data.push(property);
    } else if (property instanceof GetAccessorDeclaration) {
      const name = property.getName();

      if (!(name in computed)) {
        computed[name] = {};
      }

      computed[name].getter = property;
    } else if (property instanceof SetAccessorDeclaration) {
      const name = property.getName();

      if (!(name in computed)) {
        computed[name] = {};
      }

      computed[name].setter = property;
    } else {
      throw new Error(`Unexpected instance member of type: ${property.getKindName()}.`);
    }
  }

  for (const method of declaration.getInstanceMethods()) {
    for (const decorator of method.getDecorators()) {
      if (decorator.getName() === "Watch") {
        watches.push({
          method: method.getName(),
          ...unpackWatchDecorator(decorator),
        });

        decorator.remove();
      }
    }

    methods.push(method);
  }

  return {
    props,
    syncProps,
    data,
    computed,
    methods,
    watches,
    storeGetters,
    storeActions,
    storeMutations,
  };
}
