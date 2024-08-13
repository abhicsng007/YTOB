import React from 'react';
import { motion } from 'framer-motion';
import { cn } from "@/lib/utils";

function Heading({ title, description, Icon, iconColor, bgColor }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="px-4 lg:px-8 mb-8 mt-6"
    >
      <div className="flex items-center gap-x-4">
        <motion.div
          whileHover={{ scale: 1.1 }}
          className={cn(
            "p-3 rounded-full bg-gradient-to-br from-gray-800 to-gray-900 shadow-lg",
            bgColor
          )}
        >
          <Icon className={cn("w-8 h-8", iconColor)} />
        </motion.div>
        <div className="flex-1">
          <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600">
            {title}
          </h2>
          <p className="text-sm text-gray-400 mt-1">{description}</p>
        </div>
      </div>
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="h-0.5 bg-gradient-to-r from-blue-500 to-purple-600 mt-4"
      />
    </motion.div>
  );
}

export default Heading;