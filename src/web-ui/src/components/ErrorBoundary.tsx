import React, { type PropsWithChildren, type ErrorInfo } from "react";
import ErrorMessageBox from "~/elements/ErrorMessageBox";


interface State {
    error?: Error,
    errorInfo?: ErrorInfo,
}
type Props = PropsWithChildren;


export default class ErrorBoundary extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {};
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        this.setState({
            error: error,
            errorInfo: errorInfo,
        });
    }

    render() {
        if (this.state.error) {
            return <div className="grid h-screen place-content-center">
                <ErrorMessageBox error={this.state.error}>
                    <details className="text-left">
                        <summary className="cursor-pointer">See More</summary>
                        <pre className="break-words whitespace-break-spaces">
                            {this.state.errorInfo?.componentStack}
                        </pre>
                    </details>
                </ErrorMessageBox>
            </div>;
        } else {
            return this.props.children;
        }
    }
}
