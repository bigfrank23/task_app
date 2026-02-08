// backend/migrations/add-blurhash.js
import mongoose from 'mongoose';
import Task from '../models/task.model.js';
import axios from 'axios';
import { generateBlurhash, getImageDimensions } from '../utils/imageProcessor.js';
// import dotenv from 'dotenv';

// dotenv.config();

const migrateBlurhash = async () => {
  await mongoose.connect('mongodb://localhost:27017/todo-app');
  
  const tasks = await Task.find({ 'attachments.type': 'image' });
  
  console.log(`Found ${tasks.length} tasks with images`);
  
  for (const task of tasks) {
    let updated = false;
    
    for (const attachment of task.attachments) {
      if (attachment.type === 'image' && !attachment.blurhash) {
        try {
          // Download image
          const response = await axios.get(attachment.url, {
            responseType: 'arraybuffer'
          });
          const buffer = Buffer.from(response.data);
          
          // Generate metadata
          const dimensions = await getImageDimensions(buffer);
          const blurhash = await generateBlurhash(buffer);
          
          attachment.width = dimensions.width;
          attachment.height = dimensions.height;
          attachment.blurhash = blurhash;
          
          updated = true;
          console.log(`✅ Updated ${attachment.filename}`);
        } catch (error) {
          console.error(`❌ Failed ${attachment.filename}:`, error.message);
        }
      }
    }
    
    if (updated) {
      await task.save();
    }
  }
  
  console.log('✅ Migration complete');
  await mongoose.disconnect();
};

migrateBlurhash();