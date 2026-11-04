import type { ComponentType } from "react";
import type { VisualId } from "@/lib/interview-visuals";
import { DeadlockGraph, ProcessVsThread, SchedulingChart } from "./os-visuals";
import { OsiStack, TcpHandshake, UrlJourney } from "./networks-visuals";
import { BTreeLookup, IsolationMatrix } from "./dbms-visuals";
import { InheritanceVsComposition, SolidCards } from "./oop-visuals";
import { BigOChart, BinarySearchSteps, GraphTraversal } from "./dsa-visuals";

/** Renders the picture for a concept or question. Every id in VISUAL_IDS must have a component here. */
export const VISUALS: Record<VisualId, ComponentType> = {
  "process-thread": ProcessVsThread,
  "scheduling-gantt": SchedulingChart,
  "deadlock-cycle": DeadlockGraph,
  "osi-stack": OsiStack,
  "tcp-handshake": TcpHandshake,
  "url-journey": UrlJourney,
  "btree-lookup": BTreeLookup,
  "isolation-matrix": IsolationMatrix,
  "inheritance-composition": InheritanceVsComposition,
  "solid-cards": SolidCards,
  "big-o-chart": BigOChart,
  "binary-search": BinarySearchSteps,
  "graph-traversal": GraphTraversal,
};
