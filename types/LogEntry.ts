export interface LogEntry {
  lineNumber: number;
  timestamp: string;
  type: string;
  content: string;
  methodName?: string;
}

export interface MethodCall {
  type: 'CODE_UNIT_STARTED' | 'METHOD_ENTRY';
  methodName: string;
  lineNumber: number;
  timestamp: string;
  hasMatchingExit: boolean;
}

export interface StackTrace {
  lineNumber: number;
  stack: MethodCall[];
  unmatchedMethods: MethodCall[];
}
