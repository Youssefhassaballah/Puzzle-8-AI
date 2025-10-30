import React from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Download } from 'lucide-react';

const ResultsPanel = ({ results, algorithm, isDarkMode, onExport }) => {
  // Format runtime to show 5 decimal places
  const formatRuntime = (runtime) => {
    if (typeof runtime === 'number') {
      return `${runtime.toFixed(5)}s`;
    }
    return '';
  };

  const stats = [
    { label: '🧩 Algorithm', value: algorithm, darkClass: 'bg-gray-700 border-gray-600', lightClass: 'bg-blue-50 border-blue-200' },
    { label: '📊 Path Length', value: results?.cost, darkClass: 'bg-gray-700 border-gray-600', lightClass: 'bg-green-50 border-green-200' },
    { label: '💰 Cost', value: results?.cost, darkClass: 'bg-gray-700 border-gray-600', lightClass: 'bg-purple-50 border-purple-200' },
    { label: '🔁 Nodes Expanded', value: results?.expanded, darkClass: 'bg-gray-700 border-gray-600', lightClass: 'bg-orange-50 border-orange-200' },
    { label: '📏 Depth Reached', value: results?.depth, darkClass: 'bg-gray-700 border-gray-600', lightClass: 'bg-red-50 border-red-200' },
    { label: '⏱ Runtime', value: results ? formatRuntime(results.runtime) : '', darkClass: 'bg-gray-700 border-gray-600', lightClass: 'bg-cyan-50 border-cyan-200' }, // UPDATED: 5 decimal places
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className={`rounded-2xl shadow-lg p-6 h-fit ${
        isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      } border-2 sticky top-8`}
    >
      <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
        <BarChart3 className="w-5 h-5" />
        Results Summary
      </h2>

      {results ? (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {stats.map((stat, index) => (
              <div
                key={index}
                className={`p-3 rounded-xl border-2 ${
                  isDarkMode ? stat.darkClass : stat.lightClass
                }`}
              >
                <div className="text-sm opacity-70">{stat.label}</div>
                <div className="font-semibold">{stat.value}</div>
              </div>
            ))}
          </div>

          <div className={`p-4 rounded-xl border-2 ${
            results.found 
              ? (isDarkMode ? 'bg-green-900 border-green-700' : 'bg-green-50 border-green-200')
              : (isDarkMode ? 'bg-red-900 border-red-700' : 'bg-red-50 border-red-200')
          }`}>
            <div className="text-sm opacity-70">✅ Goal Found</div>
            <div className={`font-semibold ${results.found ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
              {results.found ? 'Yes 🎉' : 'No ❌'}
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onExport}
            className="w-full py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-semibold shadow-lg flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export Results as JSON
          </motion.button>
        </div>
      ) : (
        <div className={`text-center py-12 rounded-xl border-2 border-dashed ${
          isDarkMode ? 'border-gray-600' : 'border-gray-300'
        }`}>
          <BarChart3 className="w-12 h-12 opacity-30 mx-auto mb-4" />
          <p className="opacity-50">Run an algorithm to see results</p>
        </div>
      )}
    </motion.div>
  );
};

export default ResultsPanel;