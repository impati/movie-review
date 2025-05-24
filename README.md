# Movie Review

영화 리뷰 서비스입니다.

## 환경 설정

### 1. 환경 변수 설정

프로젝트 루트 디렉토리에 `.env` 파일을 생성하고 다음과 같이 설정합니다:

```bash
# 프로덕션 환경 (기본값)
REACT_APP_API_URL=http://review.impati.net

# 로컬 개발 환경 (.env.local)
REACT_APP_API_URL=http://localhost:8080
```

### 2. 환경별 실행 방법

#### 로컬 개발 환경에서 실행
```bash
# .env.local 파일이 있는 경우 자동으로 로컬 환경 설정을 사용합니다
npm start
```

#### 프로덕션 환경에서 실행
```bash
# .env 파일의 설정을 사용합니다
npm start
```

## 설치 및 실행

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm start
```

## 주요 기능

- 영화 상세 정보 조회
- 리뷰 작성 및 조회
- 리뷰 공감/비공감
- 스포일러 표시/숨김

## 기술 스택

- React
- TypeScript
- Material-UI
- React Router

# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).


## 프로젝트 구조

- src/ 디렉토리 내에 다음과 같은 주요 폴더들이 있습니다:
    - components/: 재사용 가능한 UI 컴포넌트들을 위한 폴더
    - pages/: 각 페이지 컴포넌트들을 위한 폴더
    - services/: API 호출과 같은 서비스 로직을 위한 폴더
    - types/: TypeScript 타입 정의를 위한 폴더