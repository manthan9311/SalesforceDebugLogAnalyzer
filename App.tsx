import { useState } from 'react';
import { FileUpload } from './components/FileUpload';
import { StackTraceDisplay } from './components/StackTraceDisplay';
import { parseLogFile, analyzeStackTrace } from './utils/logParser';
import { LogEntry, StackTrace } from './types/LogEntry';
import { trackEvent } from './analytics';
import { FileCode, Search } from 'lucide-react';

function App() {
  const [logContent, setLogContent] = useState<string>('');
  const [fileName, setFileName] = useState<string>('');
  const [logEntries, setLogEntries] = useState<LogEntry[]>([]);
  const [lineNumber, setLineNumber] = useState<string>('');
  const [stackTrace, setStackTrace] = useState<StackTrace | null>(null);
  const [error, setError] = useState<string>('');

  const handleFileUpload = (content: string, name: string) => {
    setLogContent(content);
    setFileName(name);
    const entries = parseLogFile(content);
    setLogEntries(entries);
    trackEvent('log_uploaded', { line_count: entries.length });
    setStackTrace(null);
    setLineNumber('');
    setError('');
  };

  const handleAnalyze = () => {
    const line = parseInt(lineNumber, 10);

    if (isNaN(line) || line <= 0) {
      setError('Please enter a valid line number');
      return;
    }

    if (line > logEntries.length) {
      setError(`Line number exceeds total lines (${logEntries.length})`);
      return;
    }

    setError('');
    const result = analyzeStackTrace(logEntries, line);
    setStackTrace(result);
    trackEvent('stack_trace_analyzed', { stack_depth: result.stack.length });
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleAnalyze();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <FileCode className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-800">
              Salesforce Debug Log Analyzer
            </h1>
          
            <p class="text-sm sm:text-base text-gray-400 mt-2 myDIV">  Version 1.0</p>
<p class="text-sm sm:text-base text-gray-400 mt-2 hide">Created by Manthan Shah</p>
          </div>
          <p className="text-gray-600">
            Upload a debug log and trace method execution stacks
          </p>
        </div>

        {!logContent ? (
          <FileUpload onFileUpload={handleFileUpload} />
        ) : (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-gray-800">File Loaded</h3>
                  <p className="text-sm text-gray-600">{fileName}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {logEntries.length} lines parsed
                  </p>
                </div>
                <button
                  onClick={() => {
                    setLogContent('');
                    setFileName('');
                    setLogEntries([]);
                    setStackTrace(null);
                    setLineNumber('');
                    setError('');
                  }}
                  className="px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  Upload Different File
                </button>
              </div>

              <div className="flex gap-3">
                <div className="flex-1">
                  <label
                    htmlFor="line-number"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Enter Line Number
                  </label>
                  <input
                    id="line-number"
                    type="number"
                    min="1"
                    max={logEntries.length}
                    value={lineNumber}
                    onChange={(e) => setLineNumber(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={`Enter a line number (1-${logEntries.length})`}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                  {error && (
                    <p className="text-red-600 text-sm mt-1">{error}</p>
                  )}
                </div>
                <div className="flex items-end">
                  <button
                    onClick={handleAnalyze}
                    disabled={!lineNumber}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                  >
                    <Search className="w-4 h-4" />
                    Analyze
                  </button>
                </div>
              </div>
            </div>

            {stackTrace && (
              <StackTraceDisplay
                lineNumber={stackTrace.lineNumber}
                stack={stackTrace.stack}
                unmatchedMethods={stackTrace.unmatchedMethods}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
