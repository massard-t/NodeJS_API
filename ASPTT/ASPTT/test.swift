//
//  test.swift
//  ASPTT
//
//  Created by Sullivan VITIELLO on 13/04/16.
//  Copyright © 2016 Sullivan VITIELLO. All rights reserved.
//

import UIKit

class test: UIViewController {

    @IBOutlet weak var my_border_b: UIButton!
    @IBOutlet weak var my_border: UIButton!
    let myColor : UIColor = UIColor( red: 0, green: 0, blue:0, alpha: 1.0 )

    
    @IBAction func setDefaultLabelText(sender: UIButton) {
        my_border.layer.borderWidth = 1
        my_border.layer.borderColor = myColor.CGColor
        my_border_b.layer.borderWidth = 1
        my_border_b.layer.borderColor = myColor.CGColor
    }
    
    override func viewDidLoad() {
        setDefaultLabelText(my_border);
      }
}
