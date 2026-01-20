import { MethodCall } from '../types/LogEntry';
import { Activity, AlertCircle } from 'lucide-react';

interface StackTraceDisplayProps {
  lineNumber: number;
  stack: MethodCall[];
  unmatchedMethods: MethodCall[];
}

export function StackTraceDisplay({ lineNumber, stack, unmatchedMethods }: StackTraceDisplayProps) {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center gap-2 mb-4">
          <Activity className="w-5 h-5 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-800">
            Stack Trace at Line {lineNumber}
          </h2>
        </div>

        {stack.length === 0 ? (
          <p className="text-gray-500 italic">No active methods at this line</p>
        ) : (
          <div className="space-y-2">
            {stack.map((method, index) => (
              <div
                key={index}
                className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="font-mono text-sm font-medium text-gray-800">
                      {method.methodName}
                    </p>
                    <p className="text-xs text-gray-600 mt-1">
                      {method.type} at line {method.lineNumber}
                      {method.timestamp && ` | ${method.timestamp}`}
                    </p>
                  </div>
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    Depth {index + 1}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center gap-2 mb-4">
          <AlertCircle className="w-5 h-5 text-orange-600" />
          <h2 className="text-xl font-semibold text-gray-800">
            Unmatched Method Entries
          </h2>
        </div>

        {unmatchedMethods.length === 0 ? (
          <p className="text-green-600 font-medium">
            All methods have matching exits
          </p>
        ) : (
          <div className="space-y-2">
            <p className="text-sm text-gray-600 mb-3">
              Found {unmatchedMethods.length} method{unmatchedMethods.length !== 1 ? 's' : ''} without matching exit
            </p>
            {unmatchedMethods.map((method, index) => (
              <div
                key={index}
                className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded"
              >
                <p className="font-mono text-sm font-medium text-gray-800">
                  {method.methodName}
                </p>
                <p className="text-xs text-gray-600 mt-1">
                  {method.type} at line {method.lineNumber}
                  {method.timestamp && ` | ${method.timestamp}`}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
