import React, { useState } from 'react';

const STYLES = ['flashy', 'tech', 'corporate', 'creative'];
const MODELS = ['stability-ai/sdxl', 'dall-e-3', 'black-forest-labs/flux-schnell', 'black-forest-labs/flux-dev'];
const SIZES = ['256x256', '512x512', '1024x1024'];
const QUALITIES = ['standard', 'hd'];

const LogoGenerator: React.FC = () => {
  const [formData, setFormData] = useState({
    companyName: '',
    style: 'corporate',
    primaryColor: '#000000',
    backgroundColor: '#ffffff',
    model: 'black-forest-labs/flux-schnell',
    size: '512x512',
    quality: 'standard'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [generatedLogo, setGeneratedLogo] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const generatePrompt = () => {
    return `A single logo, high-quality, award-winning professional design, made for both digital and print media for ${formData.companyName}. Style: ${formData.style}. Primary color: ${formData.primaryColor}, Background color: ${formData.backgroundColor}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const [width, height] = formData.size.split('x').map(Number);
      const API_KEY = `eyJhbGciOiJIUzI1NiIsImtpZCI6IlV6SXJWd1h0dnprLVRvdzlLZWstc0M1akptWXBvX1VaVkxUZlpnMDRlOFUiLCJ0eXAiOiJKV1QifQ.eyJzdWIiOiJnaXRodWJ8ODkxMjQ3NjUiLCJzY29wZSI6Im9wZW5pZCBvZmZsaW5lX2FjY2VzcyIsImlzcyI6ImFwaV9rZXlfaXNzdWVyIiwiYXVkIjpbImh0dHBzOi8vbmViaXVzLWluZmVyZW5jZS5ldS5hdXRoMC5jb20vYXBpL3YyLyJdLCJleHAiOjE4OTQ4NjAyNjgsInV1aWQiOiIwODJhNWM3OS0xYTEyLTQ2YjItOWVmZS1hODVlNTNlODA1MzciLCJuYW1lIjoiVW5uYW1lZCBrZXkiLCJleHBpcmVzX2F0IjoiMjAzMC0wMS0xN1QwNjowNDoyOCswMDAwIn0.u0QESuFyuPKT252bemIyTIBPJSFzyIyq44YZucp4fsQ`
      
      const response = await fetch('https://api.studio.nebius.ai/v1/images/generations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': '*/*',
          'Authorization': `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
          width,
          height,
          num_inference_steps: 4,
          negative_prompt: '',
          seed: -1,
          response_extension: 'jpg',
          response_format: 'url',
          prompt: generatePrompt(),
          model: formData.model
        })
      });

      const data = await response.json();
      
      if (data.data && data.data[0].url) {
        setGeneratedLogo(data.data[0].url);
      } else {
        throw new Error('No image URL in response');
      }
    } catch (err:any) {
      setError('Failed to generate logo: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card w-full max-w-2xl mx-auto">
      <div className="card-header">
        <h2 className="card-title">Logo Generator</h2>
      </div>
      <div className="card-content">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="companyName" className="label">Company Name</label>
            <input
              id="companyName"
              name="companyName"
              value={formData.companyName}
              onChange={handleInputChange}
              required
              className="input w-full"
            />
          </div>

          <div className="space-y-2">
            <label className="label">Style</label>
            <select
              value={formData.style}
              onChange={(e) => handleSelectChange('style', e.target.value)}
              className="select w-full"
            >
              {STYLES.map(style => (
                <option key={style} value={style}>
                  {style.charAt(0).toUpperCase() + style.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="label">Primary Color</label>
              <input
                type="color"
                name="primaryColor"
                value={formData.primaryColor}
                onChange={handleInputChange}
                className="input w-full h-10"
              />
            </div>
            <div className="space-y-2">
              <label className="label">Background Color</label>
              <input
                type="color"
                name="backgroundColor"
                value={formData.backgroundColor}
                onChange={handleInputChange}
                className="input w-full h-10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="label">AI Model</label>
            <select
              value={formData.model}
              onChange={(e) => handleSelectChange('model', e.target.value)}
              className="select w-full"
            >
              {MODELS.map(model => (
                <option key={model} value={model}>
                  {model}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="label">Image Size</label>
              <select
                value={formData.size}
                onChange={(e) => handleSelectChange('size', e.target.value)}
                className="select w-full"
              >
                {SIZES.map(size => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="label">Quality</label>
              <select
                value={formData.quality}
                onChange={(e) => handleSelectChange('quality', e.target.value)}
                className="select w-full"
              >
                {QUALITIES.map(quality => (
                  <option key={quality} value={quality}>
                    {quality.toUpperCase()}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="button w-full"
          >
            {loading ? 'Generating...' : 'Generate Logo'}
          </button>
        </form>

        {error && (
          <div className="mt-4 p-4 bg-red-50 text-red-500 rounded">
            {error}
          </div>
        )}

        {generatedLogo && (
          <div className="mt-4">
            <img 
              src={generatedLogo} 
              alt="Generated Logo" 
              className="w-full rounded shadow"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default LogoGenerator;