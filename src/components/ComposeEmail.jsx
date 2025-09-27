import { useState } from 'react';
import { Editor } from 'react-draft-wysiwyg';
import { EditorState, convertToRaw } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

const ComposeEmail = ({ senderEmail }) => {
  const [to, setTo] = useState('');
  const [subject, setSubject] = useState('');
  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  const handleSend = async () => {
    try {
      const body = draftToHtml(convertToRaw(editorState.getCurrentContent()));

      const mailData = {
        to,
        from: senderEmail || 'ajay@gmail.com',
        subject,
        body,
        timestamp: new Date().toISOString(),
        read: false,
      };

      if (!/\S+@\S+\.\S+/.test(to)) {
        alert('Please enter a valid recipient email address.');
        return;
      }

      // inbox/<receiverEmail>/{pushId}  → for inbox
      // sent/<senderEmail>/{pushId}     → for sent mails

      const cleanReceiver = (to || '').replace(/[@.]/g, '_');
      const cleanSender = (senderEmail || 'ajay@gmail.com').replace(
        /[@.]/g,
        '_'
      );

      const inboxRes = await fetch(
        `https://mail-box-client-f22d7-default-rtdb.firebaseio.com/inbox/${cleanReceiver}.json`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(mailData),
        }
      );

      if (!inboxRes.ok) throw new Error('Failed to send mail to inbox.');

      const sentRes = await fetch(
        `https://mail-box-client-f22d7-default-rtdb.firebaseio.com/sent/${cleanSender}.json`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(mailData),
        }
      );

      if (!sentRes.ok) throw new Error('Failed to save mail in sentbox.');

      alert('✅ Mail sent successfully!');
      setTo('');
      setSubject('');
      setEditorState(EditorState.createEmpty());
    } catch (err) {
      console.error('Error sending mail:', err.message);
      alert(`❌ ${err.message}`);
    }
  };

  return (
    <div className="container mt-4">
      <div className="card shadow-sm">
        <div className="card-header bg-primary text-white fw-bold">
          New Message
        </div>
        <div className="card-body">
          <div className="mb-3">
            <input
              type="email"
              placeholder="To"
              className="form-control"
              required
              value={to}
              onChange={(e) => setTo(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <input
              type="text"
              placeholder="Subject"
              className="form-control"
              required
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>

          <div
            className="mb-3 border rounded p-2"
            style={{ minHeight: '200px' }}
          >
            <Editor
              editorState={editorState}
              onEditorStateChange={setEditorState}
              wrapperClassName="wrapper-class"
              editorClassName="editor-class"
              toolbarClassName="toolbar-class"
            />
          </div>

          <button className="btn btn-success" onClick={handleSend}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ComposeEmail;
