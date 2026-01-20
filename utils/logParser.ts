import { LogEntry, MethodCall, StackTrace } from '../types/LogEntry';

export function parseLogFile(content: string): LogEntry[] {
  const lines = content.split('\n');
  const entries: LogEntry[] = [];

  lines.forEach((line, index) => {
    const lineNumber = index + 1;

    const timestampMatch = line.match(/^(\d{2}:\d{2}:\d{2}\.\d+)/);
    const timestamp = timestampMatch ? timestampMatch[1] : '';

    let type = '';
    let methodName = '';

    if (line.includes('CODE_UNIT_STARTED')) {
      type = 'CODE_UNIT_STARTED';
      const match = line.match(/CODE_UNIT_STARTED\|[^|]*\|(.+)/);
      methodName = match ? match[1].trim() : '';
    } else if (line.includes('CODE_UNIT_FINISHED')) {
      type = 'CODE_UNIT_FINISHED';
      const match = line.match(/CODE_UNIT_FINISHED\|(.+)/);
      methodName = match ? match[1].trim() : '';
    } else if (line.includes('METHOD_ENTRY')) {
      type = 'METHOD_ENTRY';
      const match = line.match(/METHOD_ENTRY\|[^|]*\|[^|]*\|(.+)/);
      methodName = match ? match[1].trim() : '';
    } else if (line.includes('METHOD_EXIT')) {
      type = 'METHOD_EXIT';
      const match = line.match(/METHOD_EXIT\|[^|]*\|[^|]*\|(.+)/);
      methodName = match ? match[1].trim() : '';
    }

    entries.push({
      lineNumber,
      timestamp,
      type,
      content: line,
      methodName,
    });
  });

  return entries;
}

export function analyzeStackTrace(entries: LogEntry[], targetLine: number): StackTrace {
  const stack: MethodCall[] = [];
  const unmatchedMethods: MethodCall[] = [];
  const methodStack: MethodCall[] = [];

  for (const entry of entries) {
    if (entry.lineNumber > targetLine) {
      break;
    }

    if (entry.type === 'CODE_UNIT_STARTED' || entry.type === 'METHOD_ENTRY') {
      const methodCall: MethodCall = {
        type: entry.type,
        methodName: entry.methodName || 'Unknown',
        lineNumber: entry.lineNumber,
        timestamp: entry.timestamp,
        hasMatchingExit: false,
      };
      methodStack.push(methodCall);
    } else if (entry.type === 'CODE_UNIT_FINISHED' || entry.type === 'METHOD_EXIT') {
      if (methodStack.length > 0) {
        const lastMethod = methodStack.pop();
        if (lastMethod) {
          lastMethod.hasMatchingExit = true;
        }
      }
    }
  }

  const stackAtLine = [...methodStack];

  const allMethods: MethodCall[] = [];
  const finalStack: MethodCall[] = [];

  for (const entry of entries) {
    if (entry.type === 'CODE_UNIT_STARTED' || entry.type === 'METHOD_ENTRY') {
      const methodCall: MethodCall = {
        type: entry.type,
        methodName: entry.methodName || 'Unknown',
        lineNumber: entry.lineNumber,
        timestamp: entry.timestamp,
        hasMatchingExit: false,
      };
      finalStack.push(methodCall);
      allMethods.push(methodCall);
    } else if (entry.type === 'CODE_UNIT_FINISHED' || entry.type === 'METHOD_EXIT') {
      if (finalStack.length > 0) {
        const lastMethod = finalStack.pop();
        if (lastMethod) {
          lastMethod.hasMatchingExit = true;
        }
      }
    }
  }

  const unmatched = allMethods.filter(m => !m.hasMatchingExit);

  return {
    lineNumber: targetLine,
    stack: stackAtLine,
    unmatchedMethods: unmatched,
  };
}
