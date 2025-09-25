<template>
  <div class="upload-page">
    <div class="upload-container">
      <h2 class="page-title">发布文章</h2>
      
      <form class="upload-form" @submit.prevent="handleSubmit">
        <div class="form-section">
          <h3 class="section-title">文章基本信息</h3>
          
          <div class="form-group">
            <label for="title" class="form-label">标题 <span class="required">*</span></label>
            <input
              id="title"
              v-model="form.title"
              type="text"
              class="form-input"
              placeholder="请输入文章标题"
              required
            />
          </div>
          
          <div class="form-row">
            <div class="form-group form-group-half">
              <label for="category" class="form-label">分类 <span class="required">*</span></label>
              <el-select
                id="category"
                v-model="form.categoryId"
                placeholder="请选择分类"
                class="form-select"
                required
              >
                <el-option
                  v-for="category in categories"
                  :key="category.id"
                  :label="category.name"
                  :value="category.id"
                ></el-option>
              </el-select>
            </div>
            
            <div class="form-group form-group-half">
              <label for="tags" class="form-label">标签</label>
              <el-select
                id="tags"
                v-model="form.tagIds"
                multiple
                placeholder="请选择标签"
                class="form-select"
              >
                <el-option
                  v-for="tag in tags"
                  :key="tag.id"
                  :label="tag.name"
                  :value="tag.id"
                ></el-option>
              </el-select>
            </div>
          </div>
          
          <div class="form-group">
            <label for="coverImage" class="form-label">封面图片</label>
            <div class="upload-image-container">
              <el-upload
                v-model:file-list="coverImageFileList"
                class="avatar-uploader"
                action="#"
                :show-file-list="true"
                :on-preview="handlePreview"
                :on-remove="handleRemove"
                :before-upload="beforeAvatarUpload"
                :auto-upload="false"
              >
                <img v-if="form.coverImage" :src="form.coverImage" class="uploaded-image" />
                <div v-else>
                  <el-icon><Plus /></el-icon>
                  <div class="el-upload__text">点击上传</div>
                </div>
              </el-upload>
            </div>
            <p class="form-hint">建议上传尺寸为 1200x630 的图片，支持 JPG、PNG 格式</p>
          </div>
          
          <div class="form-group">
            <label for="excerpt" class="form-label">摘要</label>
            <textarea
              id="excerpt"
              v-model="form.excerpt"
              class="form-textarea"
              placeholder="请输入文章摘要（选填）"
              rows="3"
            ></textarea>
          </div>
        </div>
        
        <div class="form-section">
          <h3 class="section-title">文章内容</h3>
          
          <div class="form-group">
            <label for="content" class="form-label">内容 <span class="required">*</span></label>
            <div class="editor-container">
              <!-- 简化版编辑器，实际项目中可以使用专业的富文本编辑器如 TinyMCE、Quill 等 -->
              <textarea
                id="content"
                v-model="form.content"
                class="form-textarea content-editor"
                placeholder="请输入文章内容（支持 Markdown 格式）"
                rows="15"
                required
              ></textarea>
            </div>
          </div>
        </div>
        
        <div class="form-section">
          <h3 class="section-title">发布设置</h3>
          
          <div class="form-group">
            <label class="form-checkbox-label">
              <input
                type="checkbox"
                v-model="form.published"
                class="form-checkbox"
              />
              <span>立即发布</span>
            </label>
          </div>
          
          <div v-if="!form.published" class="form-group">
            <label for="publishDate" class="form-label">计划发布时间</label>
            <el-date-picker
              id="publishDate"
              v-model="form.publishDate"
              type="datetime"
              placeholder="选择日期时间"
              class="form-datepicker"
              :disabled-date="disabledDate"
            />
          </div>
        </div>
        
        <div class="form-actions">
          <button
            type="button"
            class="cancel-button"
            @click="handleCancel"
          >
            取消
          </button>
          <button
            type="submit"
            class="submit-button"
            :disabled="loading"
          >
            <span v-if="loading">提交中...</span>
            <span v-else>{{ form.published ? '发布文章' : '保存草稿' }}</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { Plus } from '@element-plus/icons-vue';
import type { UploadFile, UploadProps } from 'element-plus';
import type { BlogPost, Category, Tag } from '../types';

const router = useRouter();

// 表单数据
const form = ref({
  title: '',
  content: '',
  excerpt: '',
  categoryId: '',
  tagIds: [] as string[],
  coverImage: '',
  published: true,
  publishDate: null as Date | null
});

// 分类和标签数据
const categories = ref<Category[]>([
  { id: '1', name: '前端开发' },
  { id: '2', name: '后端开发' },
  { id: '3', name: '数据库' },
  { id: '4', name: '工具技巧' }
]);

const tags = ref<Tag[]>([
  { id: '1', name: 'JavaScript' },
  { id: '2', name: 'Vue' },
  { id: '3', name: 'React' },
  { id: '4', name: 'TypeScript' },
  { id: '5', name: 'Node.js' },
  { id: '6', name: 'CSS' },
  { id: '7', name: 'HTML' },
  { id: '8', name: 'Go' }
]);

const loading = ref(false);
const coverImageFileList = ref<UploadFile[]>([]);

// 禁用过去的时间（计划发布时间）
const disabledDate = (time: Date) => {
  return time.getTime() < Date.now() - 8.64e7;
};

// 处理图片上传预览
const handlePreview: UploadProps['onPreview'] = (uploadFile) => {
  // 实际项目中可以实现图片预览功能
};

// 处理图片移除
const handleRemove: UploadProps['onRemove'] = (uploadFile) => {
  form.value.coverImage = '';
  return true;
};

// 上传前检查
const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
  // 检查文件类型
  const isJPG = rawFile.type === 'image/jpeg';
  const isPNG = rawFile.type === 'image/png';
  const isLt2M = rawFile.size / 1024 / 1024 < 2;

  if (!(isJPG || isPNG)) {
    ElMessage.error('上传头像图片只能是 JPG/PNG 格式!');
    return false;
  }
  if (!isLt2M) {
    ElMessage.error('上传头像图片大小不能超过 2MB!');
    return false;
  }

  // 读取图片并显示预览
  const reader = new FileReader();
  reader.readAsDataURL(rawFile);
  reader.onload = (e) => {
    form.value.coverImage = e.target?.result as string;
  };

  return false; // 阻止自动上传
};

// 处理表单提交
const handleSubmit = async () => {
  // 表单验证
  if (!form.value.title.trim()) {
    ElMessage.error('请输入文章标题');
    return;
  }
  if (!form.value.content.trim()) {
    ElMessage.error('请输入文章内容');
    return;
  }
  if (!form.value.categoryId) {
    ElMessage.error('请选择文章分类');
    return;
  }

  loading.value = true;

  try {
    // 模拟API请求延迟
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 创建新文章对象
    const newArticle: BlogPost = {
      id: `post-${Date.now()}`,
      title: form.value.title,
      content: form.value.content,
      excerpt: form.value.excerpt || form.value.content.substring(0, 150) + '...',
      coverImage: form.value.coverImage,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      author: {
        id: '1',
        name: '黄文杰',
        avatar: '/src/assets/download.webp'
      },
      category: categories.value.find(cat => cat.id === form.value.categoryId),
      tags: tags.value.filter(tag => form.value.tagIds.includes(tag.id)),
      views: 0,
      likes: 0,
      comments: []
    };

    // 保存到localStorage
    const storedArticles = localStorage.getItem('blogPosts');
    const articlesData: BlogPost[] = storedArticles ? JSON.parse(storedArticles) : [];
    articlesData.unshift(newArticle); // 添加到数组开头
    localStorage.setItem('blogPosts', JSON.stringify(articlesData));

    ElMessage.success(form.value.published ? '文章发布成功' : '草稿保存成功');

    // 跳转回首页或文章列表页
    router.push('/');
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : '操作失败，请稍后重试';
    ElMessage.error(errorMessage);
  } finally {
    loading.value = false;
  }
};

// 处理取消
const handleCancel = () => {
  // 确认是否放弃编辑
  if (form.value.title || form.value.content || form.value.excerpt) {
    if (confirm('确定要放弃编辑吗？未保存的内容将会丢失。')) {
      router.push('/');
    }
  } else {
    router.push('/');
  }
};

// 检查用户是否已登录
const checkLoginStatus = () => {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  if (!isLoggedIn) {
    ElMessage.error('请先登录');
    router.push('/login');
  }
};

// 组件挂载时检查登录状态
onMounted(() => {
  checkLoginStatus();
});
</script>

<style scoped>
.upload-page {
  padding: 20px 0;
  min-height: 100vh;
  background-color: #f5f5f5;
}

.upload-container {
  max-width: 1000px;
  margin: 0 auto;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 30px;
}

.page-title {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin-bottom: 30px;
}

.form-section {
  margin-bottom: 30px;
}

.section-title {
  font-size: 18px;
  font-weight: bold;
  color: #333;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 2px solid #f0f0f0;
}

.form-group {
  margin-bottom: 20px;
}

.form-label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #333;
  margin-bottom: 8px;
}

.required {
  color: #ff4d4f;
}

.form-input,
.form-textarea,
.form-select,
.form-datepicker {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  transition: border-color 0.2s;
}

.form-input:focus,
.form-textarea:focus,
.form-select:focus,
.form-datepicker:focus {
  outline: none;
  border-color: #4a6fa5;
}

.form-row {
  display: flex;
  gap: 20px;
}

.form-group-half {
  flex: 1;
}

.upload-image-container {
  border: 1px dashed #ddd;
  border-radius: 4px;
  padding: 20px;
  text-align: center;
  cursor: pointer;
  transition: border-color 0.2s;
}

.upload-image-container:hover {
  border-color: #4a6fa5;
}

.uploaded-image {
  max-width: 100%;
  max-height: 300px;
  border-radius: 4px;
}

.form-hint {
  font-size: 12px;
  color: #999;
  margin-top: 8px;
  margin-bottom: 0;
}

.editor-container {
  border: 1px solid #ddd;
  border-radius: 4px;
  overflow: hidden;
}

.content-editor {
  min-height: 400px;
  border: none;
  resize: vertical;
}

.form-checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: 14px;
  color: #333;
}

.form-checkbox {
  width: 16px;
  height: 16px;
  cursor: pointer;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 15px;
  margin-top: 40px;
  padding-top: 20px;
  border-top: 1px solid #f0f0f0;
}

.cancel-button,
.submit-button {
  padding: 10px 24px;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.cancel-button {
  background-color: #f5f5f5;
  color: #666;
}

.cancel-button:hover {
  background-color: #e8e8e8;
}

.submit-button {
  background-color: #4a6fa5;
  color: white;
}

.submit-button:hover:not(:disabled) {
  background-color: #3a5a8c;
}

.submit-button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .upload-container {
    padding: 20px;
  }
  
  .form-row {
    flex-direction: column;
    gap: 0;
  }
  
  .form-group-half {
    margin-bottom: 20px;
  }
  
  .form-actions {
    flex-direction: column;
  }
  
  .cancel-button,
  .submit-button {
    width: 100%;
  }
}
</style>