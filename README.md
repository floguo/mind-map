# PDF Mind Map Maker

A simple web application that converts PDF documents into interactive mind maps using Google's Gemini Pro AI. Built with Next.js and React Flow.

## Features

<strong>📄 PDF Upload & Processing</strong>
  - Drag & drop interface
  - Support for PDFs up to 5MB
  - Real-time processing feedback

<br><strong>🧠 AI-Powered Analysis</strong>
  - Automatic key point extraction
  - Context-aware organization
  - Powered by Google's Gemini Pro

<br><strong>🗺️ Interactive Mind Maps</strong>
  - Expandable/collapsible nodes
  - Draggable interface
  - Smooth animations
  - Mini-map navigation
  - Background grid for better visualization

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Mind Map Visualization**: React Flow
- **AI Integration**: Google Gemini and Vercel's AI SDK
- **Styling**: Tailwind CSS
## Getting Started

1. Clone the repository:

```bash
git clone https://github.com/floguo/mind-map.git
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Create a `.env` file in the root directory with your Google AI API key:

```env
GOOGLE_GENERATIVE_AI_API_KEY=your_api_key_here
FIRECRAWL_API_KEY=
```

4. Run the development server:

```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. Upload a PDF document using the drag & drop interface or file picker
2. Wait for the AI to analyze the document
3. Explore the generated mind map:
   - Click nodes to expand/collapse branches
   - Drag nodes to rearrange the layout
   - Use the mini-map for navigation
   - Zoom and pan to explore larger maps

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments
- [Vercel's AI SDK PDF Support](https://vercel.com/docs/ai/ai-sdk/pdf-support) for the PDF processing
- [React Flow](https://reactflow.dev/) for the mind map visualization
- [Google Generative AI](https://ai.google.dev/) for the AI-powered analysis
- [Tailwind CSS](https://tailwindcss.com/) for the styling
