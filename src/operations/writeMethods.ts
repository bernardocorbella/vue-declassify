import * as ts from "ts-morph";
import * as vue_class from "./vue_class";
import * as imports from "./imports";
import { PostprocessCallback, StoreAction, StoreMutation } from "./interface";
import { LIFECYCLE_HOOKS } from "./constants";
import { writeMethod } from "./writeMethod";
import { writeMethodsMapActions } from "./writeMethodsMapActions";
import { moduleReducer } from "./moduleReducer";
import { writeMethodsMapMutations } from "./writeMethodsMapMutations";

export function writeMethods(
  writer: ts.CodeBlockWriter,
  methods: ts.MethodDeclaration[],
  storeActions: StoreAction[],
  storeMutations: StoreMutation[]
) {
  const callbacks: PostprocessCallback[] = [];
  const lifecycleMethods: ts.MethodDeclaration[] = [];
  const normalMethods: ts.MethodDeclaration[] = [];

  for (const method of methods) {
    if (LIFECYCLE_HOOKS.includes(method.getName())) {
      lifecycleMethods.push(method);
    } else {
      normalMethods.push(method);
    }
  }

  for (const method of lifecycleMethods) {
    writeMethod(writer, method);
  }

  if (normalMethods.length > 0 || storeActions.length > 0) {
    writer
      .write("methods:")
      .space()
      .write("{")
      .newLine()
      .withIndentationLevel(1, () => {
        if (storeActions.length > 0) {
          const mappedActions = storeActions.reduce(moduleReducer("action", "actions"), {});
          if (Object.keys(mappedActions).length > 0) {
            callbacks.push((source) =>
              imports.ensure(source, "vuex", {
                named: ["mapActions"],
              })
            );
          }

          for (const [module, { actions }] of Object.entries(mappedActions)) {
            writeMethodsMapActions(writer, { module, actions });
          }
        }

        if (storeMutations.length > 0) {
          const mappedMutations = storeMutations.reduce(moduleReducer("mutation", "mutations"), {});
          if (Object.keys(mappedMutations).length > 0) {
            callbacks.push((source) =>
              imports.ensure(source, "vuex", {
                named: ["mapMutations"],
              })
            );
          }

          for (const [module, { mutations }] of Object.entries(mappedMutations)) {
            writeMethodsMapMutations(writer, { module, mutations });
          }
        }

        for (const method of normalMethods) {
          writeMethod(writer, method);
        }
      })
      .writeLine("},");
  }

  return callbacks;
}
