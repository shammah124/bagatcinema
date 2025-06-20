// src/components/ErrorBoundary.jsx
import { Component } from "react";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4 sm:px-6 md:px-10">
          <div className="text-center space-y-6 max-w-md w-full">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-red-400">
              Something went wrong
            </h1>
            <p className="text-sm sm:text-base text-gray-400">
              An unexpected error occurred. Please try refreshing the page or
              contact support if the issue persists.
            </p>
            <button
              onClick={this.handleReload}
              className="mt-4 inline-block px-5 py-2 rounded-md bg-red-500 hover:bg-red-600 text-white text-sm sm:text-base transition duration-200">
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
