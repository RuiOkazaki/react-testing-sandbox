import { act, fireEvent, render, screen } from "@testing-library/react"

import { AsyncCounter } from "./"

describe("AsyncCounter", () => {
  test("render", () => {
    const { asFragment } = render(<AsyncCounter />)
    expect(asFragment()).toMatchSnapshot()
  })

  describe("click:count:カウントアップ", () => {
    test("ボタン押下 1 秒後は 1 カウントアップ", () => {
      // setTimeoutを詐称する
      // - 10秒後に実行される処理など待っているとテストが終わらないので、詐称する
      jest.useFakeTimers()
      render(<AsyncCounter />)
      // getByText:
      // 要素が存在しない場合、例外をスローします。
      // 存在することを前提としたテストに使用されます。
      // テスト中に要素が存在しないことを想定することができません。
      const button = screen.getByText("AsyncIncrement")
      fireEvent.click(button)
      act(() => {
        // n ms後に実行される処理を実行
        jest.runAllTimers()
      })
      screen.getByText("AsyncCount: 1")
      // setTimeoutを戻す
      jest.useRealTimers()
    })
  })

  describe("click:count:ボタン活性・非活性", () => {
    test("ボタン押下直後はボタンが非活性", () => {
      render(<AsyncCounter />)
      // HTML Elementが返却される
      const button = screen.getByText("AsyncIncrement")
      fireEvent.click(button)
      expect(button).toBeDisabled()
    })

    test("ボタン押下 1 秒後はボタンが活性", () => {
      jest.useFakeTimers()
      render(<AsyncCounter />)
      const button = screen.getByText("AsyncIncrement")
      fireEvent.click(button)
      act(() => {
        jest.runAllTimers()
      })
      // setTimeOutが終わったらボタンが活性になる
      expect(button).not.toBeDisabled()
      jest.useRealTimers()
    })
  })

  describe("click:count:ローディング UI", () => {
    test("ボタン押下直後はローディングが表示", () => {
      render(<AsyncCounter />)
      const button = screen.getByText("AsyncIncrement")
      fireEvent.click(button)
      // queryByText:
      // 要素が存在しない場合、nullを返します。
      // 存在しない場合を想定したテストに使用されます。
      // テスト中に要素が存在しないことを想定することができます。
      expect(screen.queryByText("...Loading")).toBeInTheDocument() //要素がドキュメントに存在することを確認している
    })
    test("ボタン押下直後はローディングが非表示", () => {
      jest.useFakeTimers()
      render(<AsyncCounter />)
      const button = screen.getByText("AsyncIncrement")
      fireEvent.click(button)
      act(() => {
        jest.runAllTimers()
      })
      expect(screen.queryByText("...Loading")).not.toBeInTheDocument()
      jest.useRealTimers()
    })
  })
})
