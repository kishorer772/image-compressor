import * as React from 'react';
import FileInput from './FileInput';
import Resizer from 'react-image-file-resizer';
import { CSSTransition } from 'react-transition-group';
import './App.css';
import TransitionApp from './TransitionApp';
export interface IAppProps {}
const initialState = {
  ratio: '100',
  width: '',
  height: '',
};
const ASPECT_RATIO = 16 / 9;
export default function ImageCompressor(props: IAppProps) {
  const [custom, setCustom] = React.useState(false);
  const [compressedImg, setCompressedImg] = React.useState<string | null>(null);
  //   const file = React.useRef<File>();
  const [file, setFile] = React.useState<File>();
  const [info, setInfo] = React.useState({
    ratio: '100',
    width: '',
    height: '',
  });
  const [view, setView] = React.useState(false);
  const resizeImage = async (file: File) => {
    if (Object.values(info).some((item) => item === '')) return;
    try {
      await Resizer.imageFileResizer(
        file,
        info.width ? +info.width : 1000, // max width
        +info.height, // max height
        'JPEG', // output format
        info.ratio ? +info.ratio : 100, // quality (1-100)
        0, // rotation
        (uri) => {
          if (typeof uri === 'string') {
            console.log(uri);
            setCompressedImg(uri); // Store base64 string to display in <img>
          } else if (uri instanceof Blob) {
            const resizedFile = new File([uri], 'resized-image.jpg', {
              type: 'image/jpeg',
            });
            const fileReader = new FileReader();
            fileReader.onload = () => {
              setCompressedImg(fileReader.result as string); // Set base64 string
            };
            fileReader.readAsDataURL(resizedFile); // Convert File to base64 for <img src>
          }
        },
        'blob' // output type ('base64' or 'blob')
      );
    } catch (error) {
      console.error('Error', error);
    }
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // file.current = e.target.files?.[0] as File;
    console.log(e.target.files?.[0]);
    setFile(e.target.files?.[0] as File);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'width') {
      setInfo((prev) => ({
        ...prev,
        [name]: value,
        height: (+value / ASPECT_RATIO).toString(),
      }));
    } else {
      setInfo((prev) => ({ ...prev, [name]: value }));
    }
  };
  const handleDownloadImg = () => {
    try {
      const base64Data = compressedImg!.split(',')[1];

      const byteCharacters = atob(base64Data);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);

      const blob = new Blob([byteArray], { type: 'image/jpeg' });

      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `image-${info.ratio}-${info.width}.jpg`;
      link.click();

      URL.revokeObjectURL(link.href);
    } catch (error) {
      console.error('Error', error);
    }
  };

  const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value);
    switch (e.target.value) {
      case '1':
        setInfo((prev) => ({
          ...prev,
          ratio: '25',
          width: '200',
          height: '200',
        }));
        break;
      case '2':
        setInfo((prev) => ({
          ...prev,
          ratio: '50',
          width: '500',
          height: (640 / ASPECT_RATIO).toString(),
        }));
        break;
      case '3':
        setInfo((prev) => ({
          ...prev,
          ratio: '75',
          width: '768',
          height: (768 / ASPECT_RATIO).toString(),
        }));
        break;
    }
  };
  const handleCustom = () => {
    setCustom((prev) => !prev);
  };
  const handleGenerateImg = () => {
    if (file) {
      resizeImage(file);
    }
  };
  return (
    <>
      <form
        action=""
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <div
          style={{
            maxWidth: 'calc(min(50vw, 500px))',
            margin: '0 auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
          }}
        >
          {' '}
          {!compressedImg ? (
            <>
              <FileInput
                onChange={(e) => handleFileChange(e)}
                // disabled={Object.values(info).some((item) => item === '')}
              />
              <button onClick={handleCustom}>
                {custom ? 'Auto' : 'Customise'}
              </button>

              <TransitionApp isOpen={custom}>
                <div
                  className="fade"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem',
                  }}
                >
                  <input
                    type="number"
                    placeholder="Optimise Percentage"
                    onChange={handleChange}
                    aria-labelledby="compression"
                    max={100}
                    min={20}
                    name="ratio"
                  />
                  <input
                    type="number"
                    aria-labelledby="width"
                    name="width"
                    placeholder="width"
                    onChange={handleChange}
                  />
                </div>
              </TransitionApp>
              <TransitionApp isOpen={!custom}>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <input
                    type="radio"
                    value={1}
                    name="quality"
                    aria-label="low"
                    id="low"
                    onChange={handleChangeInput}
                  />
                  <label htmlFor="low">Low </label>
                  <input
                    type="radio"
                    value={2}
                    name="quality"
                    aria-label="medium"
                    id="medium"
                    onChange={handleChangeInput}
                  />
                  <label htmlFor="medium">Medium</label>
                  <input
                    type="radio"
                    value={3}
                    name="quality"
                    aria-label="high"
                    id="high"
                    onChange={handleChangeInput}
                  />
                  <label htmlFor="high">High</label>
                </div>
              </TransitionApp>
              <button onClick={handleGenerateImg}>Generate</button>
              <hr />
            </>
          ) : (
            <>
              <h2 style={{ textAlign: 'center', fontWeight: 600 }}>
                Ratio -<span>{info.ratio}</span> Width -{' '}
                <span>{info.width}</span>
              </h2>

              <>
                <button
                  onClick={() => {
                    setCompressedImg(null);
                    setInfo(initialState);
                  }}
                >
                  Clear
                </button>
                <button onClick={() => setView(!view)}>
                  {view ? 'Hide' : 'View'}
                </button>
                <button onClick={handleDownloadImg}>Download</button>
              </>
              {view && (
                <img
                  src={compressedImg}
                  alt="Compressed"
                  width={`${info.width}px`}
                  height={`${info.height}px`}
                />
              )}
            </>
          )}
        </div>
      </form>
    </>
  );
}
